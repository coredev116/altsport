import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { v4 } from "uuid";
import { parse, getYear, isAfter } from "date-fns";

import Tours from "../../../../entities/wsl/tours.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";
import Events from "../../../../entities/wsl/events.entity";
import Athletes from "../../../../entities/wsl/athletes.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";

import WSLHelperService from "../../../system/sync/wsl/sync.wsl.helpers.service";
import WSLService from "../../../../services/wsl.service";
// import QueueService from "../../../system/queue/queue.service";

import ISeasonRanks from "../../../../interfaces/wsl/seasonRanks";

import TourDto from "./dto/tours.dto";

import {
  EventStatus,
  HeatStatus,
  RoundStatus,
  Gender,
  AthleteStatus,
  // SportsTypes,
} from "../../../../constants/system";

import { fetchOpeningRoundSeedPlacements, postCutDate } from "../../../../constants/wsl";

@Injectable()
export default class TourService {
  constructor(
    @InjectRepository(Tours) private readonly tourRepository: Repository<Tours>,
    @InjectRepository(TourYears) private readonly tourYearRepository: Repository<TourYears>,
    @InjectRepository(Athletes) private readonly athletesRepository: Repository<Athletes>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats) private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(SimulationWeights)
    private readonly simulationWeightsRepository: Repository<SimulationWeights>,

    // private queueService: QueueService,
    private readonly wslService: WSLService,
    private readonly wslHelperService: WSLHelperService,
  ) {}

  async createTour(body: TourDto): Promise<boolean> {
    await this.tourRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            let tour = await transactionalEntityManager.findOne(Tours, {
              where: { name: item.name, gender: item.gender },
              relations: ["years"],
            });

            if (!tour) {
              // tour does not exist, add a new one
              const newTour = this.tourRepository.create({
                name: item.name,
                gender: item.gender,
                years: [
                  {
                    year: item.year,
                  },
                ],
              });

              tour = await transactionalEntityManager.save(newTour);
            } else {
              // tour exists, check if the year exists for that tour as well
              const year = tour.years?.find((tourYear) => tourYear.year === item.year);
              if (!year) {
                // add the year for that tour
                const createdTourYear = this.tourYearRepository.create({
                  tourId: tour.id,
                  year: item.year,
                });
                await transactionalEntityManager.save(createdTourYear);
              }
            }
          } catch (error) {
            throw error;
          }
        }
      },
    );

    return true;
  }

  async interimEventSeed(gender: Gender): Promise<boolean> {
    try {
      const now: Date = new Date();

      // FIXME: this is likely going to break at the time it shifts from pre-cut to post cut since the rounds change

      const tourYear = await this.tourYearRepository.findOne({
        where: {
          year: now.getFullYear(),
          tour: {
            gender,
          },
        },
        select: {
          id: true,
          tourId: true,
          tour: {
            id: true,
            gender: true,
          },
        },
      });

      const [lastEvent, nextEvent] = await Promise.all([
        this.eventsRepository.findOne({
          where: {
            tourYearId: tourYear.id,
            eventStatus: EventStatus.COMPLETED,
            isActive: true,
            isArchived: false,
          },
          select: {
            id: true,
            name: true,
          },
          order: {
            endDate: "DESC",
          },
        }),
        this.eventsRepository.findOne({
          where: {
            tourYearId: tourYear.id,
            eventStatus: EventStatus.UPCOMING,
            isActive: true,
            isArchived: false,
          },
          select: {
            id: true,
            name: true,
            startDate: true,
          },
          order: {
            startDate: "ASC",
          },
        }),
      ]);

      const lastEventRounds = await this.eventRoundsRepository.find({
        where: {
          eventId: lastEvent.id,
          isActive: true,
          isArchived: false,
          round: {
            heats: {
              eventId: lastEvent.id,
            },
          },
        },
        relations: ["round.heats"],
        select: {
          id: true,
          eventId: true,
          roundId: true,
          round: {
            id: true,
            roundNo: true,
            heats: {
              id: true,
              eventId: true,
              roundId: true,
              heatName: true,
              heatNo: true,
            },
          },
        },
      });

      const eventRounds: EventRounds[] = [];
      const roundHeats: RoundHeats[] = [];
      const openingRoundHeatsObj: {
        [key: string]: string;
      } = {};
      lastEventRounds.forEach((round) => {
        eventRounds.push(
          this.eventRoundsRepository.create({
            eventId: nextEvent.id,
            roundId: round.roundId,
            roundStatus: RoundStatus.UPCOMING,
          }),
        );

        round.round.heats.map((heat) => {
          const heatId: string = v4();

          if (round.round.roundNo === 1) openingRoundHeatsObj[heat.heatNo] = heatId;

          roundHeats.push(
            this.roundHeatsRepository.create({
              id: heatId,
              eventId: nextEvent.id,
              roundId: heat.roundId,
              heatName: heat.heatName,
              heatNo: heat.heatNo,
              heatStatus: HeatStatus.UPCOMING,
            }),
          );
        });
      });

      const eventWeights: SimulationWeights[] = await this.simulationWeightsRepository.find({
        where: {
          eventId: nextEvent.id,
        },
        select: {
          type: true,
          year: true,
          location: true,
          weight: true,
        },
      });

      const athleteData = await this.wslService.fetchSeasonRanking(gender);

      const dbAthletes = await this.athletesRepository.find({
        where: {
          gender,
          isActive: true,
          isArchived: false,
        },
      });

      const tiers: {
        [tier: string]: {
          start: number; // when a tier starts
          end: number; // when a tier ends
          count: number; // maintains the count of each tier
          tier: string;
        };
      } = {
        A: {
          start: 1,
          end: 4,
          count: 0,
          tier: "A",
        },
        B: {
          start: 5,
          end: 12,
          count: 0,
          tier: "B",
        },
        C: {
          start: 3,
          end: 24,
          count: 0,
          tier: "C",
        },
      };

      // for mens there are only 23 participant and 1 wildcard
      // for womens 11 and 1 wildcard
      const wildcardInclusiveAthletes: ISeasonRanks[] = [
        ...athleteData.sort((a, b) => a.rank - b.rank).slice(0, gender === Gender.MALE ? 23 : 11),
        {
          athlete: {
            athleteId: v4(),
            firstName: "Wildcard",
            gender: gender === Gender.MALE ? "M" : "F",
          },
          rank: gender === Gender.MALE ? 24 : 12,
        } as ISeasonRanks,
      ];

      await this.eventsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await Promise.all([
            transactionalEntityManager.save(EventRounds, eventRounds),
            transactionalEntityManager.save(RoundHeats, roundHeats),
            // archive existing and re-instate later
            await transactionalEntityManager.update(
              EventParticipants,
              {
                eventId: nextEvent.id,
              },
              {
                isActive: false,
                isArchived: true,
              },
            ),
          ]);

          const eventParticipants = [];

          for await (const athlete of wildcardInclusiveAthletes) {
            let dbAthlete: Partial<Athletes> = dbAthletes.find(
              (athleteItem) => athleteItem.providerId === athlete.athlete.athleteId,
            );

            if (!dbAthlete) {
              dbAthlete = {
                id: v4(),
              };
              await transactionalEntityManager.save(Athletes, {
                id: dbAthlete.id,
                firstName: athlete.athlete.firstName,
                lastName: athlete.athlete.lastName,
                dob: athlete.athlete.birthdate
                  ? parse(athlete.athlete.birthdate, "yyyy-MM-dd", now)
                  : null,
                gender: athlete.athlete.gender === "M" ? Gender.MALE : Gender.FEMALE,
                nationality: athlete.athlete.nationAbbr,
                stance: athlete.athlete.stance,
                hometown: athlete.athlete.hometown,
                providerId: athlete.athlete.athleteId,
                yearPoints: dbAthlete.yearPoints || 0,
                yearRank: dbAthlete.yearRank || 0,
                yearStatus: dbAthlete.yearStatus || 1,
                playerStatus: AthleteStatus.ACTIVE,
              });
            }

            // for wildcard entries, hardcode the projection
            const baseProjection = ![12, 24].includes(athlete.rank)
              ? await this.wslHelperService.fetchAthleteProjection(
                  dbAthlete.id,
                  gender,
                  eventWeights,
                )
              : 7.9;

            const tierObj = Object.values(tiers).find(
              (tier) => athlete.rank >= tier.start && athlete.rank <= tier.end,
            );

            tiers[tierObj.tier].count += 1;

            eventParticipants.push(
              this.eventParticipantsRepository.create({
                eventId: nextEvent.id,
                athleteId: dbAthlete.id,
                seedNo: athlete.rank,
                tier: tierObj.tier,
                tierSeed: `${tierObj.count}`,
                baseProjection,
                isActive: true,
                isArchived: false,
                status: AthleteStatus.ACTIVE,
              }),
            );
          }

          const isPostCut: boolean = isAfter(
            nextEvent.startDate,
            postCutDate(getYear(nextEvent.startDate)),
          );
          const openingRoundConfig: {
            [key: number]: number[];
          } = fetchOpeningRoundSeedPlacements(isPostCut, gender);
          const scorePayload: Scores[] = [];
          Object.keys(openingRoundConfig).forEach((key) => {
            // const heat = heats.find((heatItem) => heatItem.heatNo === +key);
            const seeds: number[] = openingRoundConfig[key];

            const participants = eventParticipants.filter((participant) =>
              seeds.includes(participant.seedNo),
            );

            scorePayload.push(
              ...participants.map((eventParticipant) =>
                this.scoresRepository.create({
                  eventId: nextEvent.id,
                  roundHeatId: openingRoundHeatsObj[key],
                  athleteId: eventParticipant.athleteId,
                  roundSeed: eventParticipant.seedNo,
                  heatScore: 0,
                }),
              ),
            );
          });

          await Promise.all([
            transactionalEntityManager.save(EventParticipants, eventParticipants),
            transactionalEntityManager.save(Scores, scorePayload),
          ]);

          // await this.queueService.notifyEventUpdate({
          //   eventId: nextEvent.id,
          //   delaySeconds: 10,
          //   sportType: SportsTypes.SURFING,
          // });

          return true;
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }
}
