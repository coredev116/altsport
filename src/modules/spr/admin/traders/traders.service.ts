import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In } from "typeorm";

import Events from "../../../../entities/spr/events.entity";
import Tours from "../../../../entities/spr/tours.entity";
import RoundHeats from "../../../../entities/spr/roundHeats.entity";
import Athletes from "../../../../entities/spr/athletes.entity";
import Scores from "../../../../entities/spr/scores.entity";
import EventParticipants from "../../../../entities/spr/eventParticipants.entity";
import EventRounds from "../../../../entities/spr/eventRounds.entity";
import ProjectionEventOutcome from "../../../../entities/spr/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/spr/projectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/spr/playerHeadToHeads.entity";
import ProjectionEventShows from "../../../../entities/spr/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/spr/projectionEventPodiums.entity";
import PropBets from "../../../../entities/spr/propBets.entity";
import ClientProjectionEventOutcome from "../../../../entities/spr/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/spr/clientProjectionEventHeatOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/spr/clientPlayerHeadToHeads.entity";
import ClientProjectionEventShows from "../../../../entities/spr/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/spr/clientProjectionEventPodiums.entity";
import ClientPropBets from "../../../../entities/spr/clientPropBets.entity";

import TraderScores from "./dto/traderScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";
import ProjectionEventOutcomeOddsDto from "./dto/addProjectionEventOutcome.dto";
import ProjectionEventHeatOutcomeOddsDto from "./dto/addProjectionEventHeatOutcome.dto";
import ProjectionEventShowsOddsDto from "./dto/addProjectionEventShows.dto";
import ProjectionEventPodiumsOddsDto from "./dto/addProjectionEventPodiums.dto";
import ProjectionEventPropBetsDto from "./dto/addProjectionEventPropBets.dto";
import PlayerHeadToHeadDto from "./dto/addPlayerHeadToHead.dto";

import * as eventExceptions from "../../../../exceptions/events";
import * as eventRoundExceptions from "../../../../exceptions/eventRound";

import { IParticipantReplacement } from "../../../../interfaces/participants";
import {
  AthleteStatus,
  RoundStatus,
  EventStatus,
  SportsTypes,
  OddMarkets,
  SportsDbSchema,
} from "../../../../constants/system";

import QueueService from "../../../system/queue/queue.service";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Tours) private readonly toursRepository: Repository<Tours>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
    @InjectRepository(Athletes) private readonly athletesRepository: Repository<Athletes>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(EventRounds) private readonly eventRoundRepository: Repository<EventRounds>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,
    @InjectRepository(ProjectionEventHeatOutcome)
    private readonly projectionEventHeatOutcomeRepository: Repository<ProjectionEventHeatOutcome>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    @InjectRepository(ProjectionEventShows)
    private readonly projectionEventShowsRepository: Repository<ProjectionEventShows>,
    @InjectRepository(ProjectionEventPodiums)
    private readonly projectionEventPodiumsRepository: Repository<ProjectionEventPodiums>,
    @InjectRepository(PropBets)
    private readonly propBetsRepository: Repository<PropBets>,

    @InjectRepository(ClientProjectionEventOutcome)
    private readonly clientProjectionEventOutcomeRepository: Repository<ClientProjectionEventOutcome>,
    @InjectRepository(ClientProjectionEventHeatOutcome)
    private readonly clientProjectionEventHeatOutcomeRepository: Repository<ClientProjectionEventHeatOutcome>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
    @InjectRepository(ClientProjectionEventShows)
    private readonly clientProjectionEventShowsRepository: Repository<ClientProjectionEventShows>,
    @InjectRepository(ClientProjectionEventPodiums)
    private readonly clientProjectionEventPodiumsRepository: Repository<ClientProjectionEventPodiums>,

    private queueService: QueueService,
  ) {}

  async addProjectionEventOutcomeOdds(
    oddsPayload: ProjectionEventOutcomeOddsDto,
  ): Promise<boolean> {
    await this.projectionEventOutcomeRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        const eventsSet = new Set<string>();

        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;
            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(ProjectionEventOutcome, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientProjectionEventOutcome,
                  {
                    eventId: event.id,
                    position: odd.position,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            const nameSplit = odd.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            await Promise.all([
              transactionalEntityManager.save(
                this.projectionEventOutcomeRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  position: odd.position,
                  odds: odd.odds,
                  probability: odd.probability,
                }),
              ),
              transactionalEntityManager.save(
                this.clientProjectionEventOutcomeRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  position: odd.position,
                  odds: odd.odds,
                  probability: odd.probability,
                }),
              ),
            ]);
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];
        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.EVENT_WINNER_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async addProjectionEventHeatOutcomeOdds(
    oddsPayload: ProjectionEventHeatOutcomeOddsDto,
  ): Promise<boolean> {
    await this.projectionEventHeatOutcomeRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        const eventsSet = new Set<string>();

        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;
            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(ProjectionEventHeatOutcome, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientProjectionEventHeatOutcome,
                  {
                    eventId: event.id,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            const nameSplit = odd.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            const eventRound = await this.eventRoundRepository.findOne({
              where: {
                eventId: event.id,
                round: {
                  name: odd.round,
                },
              },
              select: {
                id: true,
                eventId: true,
                roundId: true,
                round: {
                  id: true,
                  roundNo: true,
                  name: true,
                },
              },
              relations: ["round"],
            });
            if (!eventRound) continue;
            const { round } = eventRound;

            if (!round) continue;

            const roundHeat = await this.heatsRepository.findOne({
              where: {
                eventId: event.id,
                roundId: round.id,
                heatNo: odd.heatNumber,
              },
              select: {
                id: true,
                heatName: true,
              },
            });
            if (!roundHeat) continue;

            await Promise.all([
              transactionalEntityManager.save(
                this.projectionEventHeatOutcomeRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  roundHeatId: roundHeat.id,
                  position: odd.position,
                  odds: odd.odds,
                  probability: odd.probability,
                }),
              ),
              transactionalEntityManager.save(
                this.clientProjectionEventHeatOutcomeRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  roundHeatId: roundHeat.id,
                  position: odd.position,
                  odds: odd.odds,
                  probability: odd.probability,
                }),
              ),
            ]);
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];
        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.HEAT_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async addProjectionEventPropBets(oddsPayload: ProjectionEventPropBetsDto): Promise<boolean> {
    await this.propBetsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        const eventsSet = new Set<string>();

        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(PropBets, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientPropBets,
                  {
                    eventId: event.id,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            let eventParticipant: EventParticipants = null;
            if (odd.athlete) {
              const nameSplit = odd.athlete.trim().split(" ");
              const athleteFirstName = nameSplit?.[0]?.trim();
              const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
              // to avoid having the firt name also as the last name
              const athleteLastName =
                nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

              const athleteQuery = transactionalEntityManager
                .createQueryBuilder(Athletes, "athletes")
                .select(["athletes.id as id"])
                .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                  firstName: athleteFirstName,
                });
              if (athleteLastName)
                athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                  lastName: athleteLastName,
                });
              let athlete = await athleteQuery
                .andWhere({
                  isActive: true,
                  isArchived: false,
                })
                .getRawOne();

              if (!athlete) {
                athlete = await transactionalEntityManager.save(
                  this.athletesRepository.create({
                    firstName: athleteFirstName,
                    middleName: athleteMiddleName,
                    lastName: athleteLastName,
                    gender: odd.gender,
                    playerStatus: AthleteStatus.ACTIVE,
                  }),
                );
              }

              eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
                where: {
                  eventId: event.id,
                  athleteId: athlete.id,
                },
                select: {
                  id: true,
                  seedNo: true,
                  athleteId: true,
                },
              });

              if (!eventParticipant) {
                eventParticipant = await transactionalEntityManager.save(
                  this.eventParticipantsRepository.create({
                    athleteId: athlete.id,
                    eventId: event.id,
                    seedNo: participantSeedCount++,
                    baseProjection: 0,
                    soloCrashRate: 0,
                    baseHeadLapTime: 0,
                    headCrashRate: 0,
                    raceCrashRate: 0,
                    baseNonJokerLapTime: 0,
                    status: AthleteStatus.ACTIVE,
                  }),
                );
              }
            }

            await transactionalEntityManager.save(
              this.propBetsRepository.create({
                eventId: event.id,
                eventParticipantId: eventParticipant?.id || null,
                odds: odd.odds,
                proposition: odd.proposition,
              }),
            );
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];

        if (affectedEventIds.length)
          await transactionalEntityManager.query(`
        INSERT INTO ${
          SportsDbSchema.SPR
        }."clientPropBets"("eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided")
        SELECT "eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided" FROM ${
          SportsDbSchema.SPR
        }."propBets"
        WHERE ${SportsDbSchema.SPR}."propBets"."eventId" IN ( ${affectedEventIds
            .map((item) => `'${item}'`)
            .join(",")} );
      `);

        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.PROP_BET_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async addProjectionEventShowsOdds(oddsPayload: ProjectionEventShowsOddsDto): Promise<boolean> {
    await this.projectionEventShowsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        const eventsSet = new Set<string>();

        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(ProjectionEventShows, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientProjectionEventShows,
                  {
                    eventId: event.id,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            const nameSplit = odd.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            await Promise.all([
              transactionalEntityManager.save(
                this.projectionEventShowsRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  odds: odd.odds,
                }),
              ),
              transactionalEntityManager.save(
                this.clientProjectionEventShowsRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  odds: odd.odds,
                }),
              ),
            ]);
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];
        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.SHOWS_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async addProjectionEventPodiumsOdds(
    oddsPayload: ProjectionEventPodiumsOddsDto,
  ): Promise<boolean> {
    await this.projectionEventPodiumsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        //const affectedEventIds: string[] = [];
        const eventsSet = new Set<string>();
        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(ProjectionEventPodiums, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientProjectionEventPodiums,
                  {
                    eventId: event.id,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            //affectedEventIds.push(event.id);

            const nameSplit = odd.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            await Promise.all([
              transactionalEntityManager.save(
                this.projectionEventPodiumsRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  odds: odd.odds,
                }),
              ),
              transactionalEntityManager.save(
                this.clientProjectionEventPodiumsRepository.create({
                  eventId: event.id,
                  eventParticipantId: eventParticipant.id,
                  odds: odd.odds,
                }),
              ),
            ]);
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];
        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.PODIUM_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async addPlayerHeadToHeadsOdds(oddsPayload: PlayerHeadToHeadDto): Promise<boolean> {
    await this.playerHeadToHeadsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;
        const eventsSet = new Set<string>();

        for await (const odd of oddsPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: odd.tourName,
                gender: odd.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === odd.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: odd.event,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            if (event?.id && !eventsSet.has(event?.id)) {
              // also clear existing projections and client projections
              eventsSet.add(event.id);

              await Promise.all([
                transactionalEntityManager.delete(PlayerHeadToHeads, {
                  eventId: event.id,
                }),
                transactionalEntityManager.update(
                  ClientPlayerHeadToHeads,
                  {
                    eventId: event.id,
                  },
                  {
                    isActive: false,
                    isArchived: true,
                  },
                ),
              ]);
            }

            const nameSplit1 = odd.athlete1.trim().split(" ");
            const athlete1FirstName = nameSplit1?.[0]?.trim();
            const athlete1MiddleName = nameSplit1.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athlete1LastName =
              nameSplit1.length > 1 ? nameSplit1?.[nameSplit1.length - 1].trim() : "";

            const athlete1Query = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athlete1FirstName,
              });
            if (athlete1LastName)
              athlete1Query.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athlete1LastName,
              });
            let athlete1 = await athlete1Query
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete1) {
              athlete1 = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athlete1FirstName,
                  middleName: athlete1MiddleName,
                  lastName: athlete1LastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant1 = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete1.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant1) {
              eventParticipant1 = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete1.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            const nameSplit2 = odd.athlete2.trim().split(" ");
            const athlete2FirstName = nameSplit2?.[0]?.trim();
            const athlete2MiddleName = nameSplit2.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athlete2LastName =
              nameSplit2.length > 1 ? nameSplit2?.[nameSplit2.length - 1].trim() : "";

            const athlete2Query = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athlete2FirstName,
              });
            if (athlete2LastName)
              athlete1Query.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athlete2LastName,
              });
            let athlete2 = await athlete2Query
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete2) {
              athlete2 = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athlete2FirstName,
                  middleName: athlete2MiddleName,
                  lastName: athlete2LastName,
                  gender: odd.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant2 = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete2.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant2) {
              eventParticipant2 = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete2.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipantWinnerId;
            if (odd.athleteWinner === odd.athlete1) {
              eventParticipantWinnerId = eventParticipant1.id;
            }
            if (odd.athleteWinner === odd.athlete2) {
              eventParticipantWinnerId = eventParticipant2.id;
            }

            await Promise.all([
              transactionalEntityManager.save(
                this.playerHeadToHeadsRepository.create({
                  eventId: event.id,
                  eventParticipant1Id: eventParticipant1.id,
                  eventParticipant2Id: eventParticipant2.id,
                  eventParticipantWinnerId,
                  player1Position: odd.athlete1Position,
                  player2Position: odd.athlete2Position,
                  player1Odds: odd.athlete1Odds,
                  player2Odds: odd.athlete2Odds,
                  player1Probability: odd.athlete1Probability,
                  player2Probability: odd.athlete2Probability,
                  voided: odd.voided,
                  draw: odd.draw,
                }),
              ),
              transactionalEntityManager.save(
                this.clientPlayerHeadToHeadsRepository.create({
                  eventId: event.id,
                  eventParticipant1Id: eventParticipant1.id,
                  eventParticipant2Id: eventParticipant2.id,
                  eventParticipantWinnerId,
                  player1Position: odd.athlete1Position,
                  player2Position: odd.athlete2Position,
                  player1Odds: odd.athlete1Odds,
                  player2Odds: odd.athlete2Odds,
                  player1Probability: odd.athlete1Probability,
                  player2Probability: odd.athlete2Probability,
                  voided: odd.voided,
                  draw: odd.draw,
                }),
              ),
            ]);
          } catch (error) {
            throw error;
          }
        }

        const affectedEventIds: string[] = [...eventsSet];
        if (affectedEventIds.length)
          await Promise.all(
            [...new Set(affectedEventIds)].map((eventId) =>
              this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SUPERCROSS,
                market: OddMarkets.HEAD_TO_HEAD_PROJECTIONS,
              }),
            ),
          );
      },
    );
    return true;
  }

  async saveScores(scoresPayload: TraderScores): Promise<boolean> {
    await this.scoresRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;

        for await (const score of scoresPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: score.tourName,
                gender: score.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === score.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: score.eventName,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            const eventRound = await this.eventRoundRepository.findOne({
              where: {
                eventId: event.id,
                round: {
                  name: score.roundName,
                },
              },
              select: {
                id: true,
                eventId: true,
                roundId: true,
                round: {
                  id: true,
                  roundNo: true,
                  name: true,
                },
              },
              relations: ["round"],
            });
            if (!eventRound) continue;
            const { round } = eventRound;

            if (!round) continue;

            const roundHeat = await this.heatsRepository.findOne({
              where: {
                eventId: event.id,
                roundId: round.id,
                heatNo: score.heatNumber,
              },
              select: {
                id: true,
                heatName: true,
              },
            });
            if (!roundHeat) continue;

            const nameSplit = score.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            // const athleteWhereClause: Partial<Athletes> = {
            //   firstName: athleteFirstName,
            // };
            // if (athleteMiddleName) athleteWhereClause.middleName = athleteMiddleName;
            // if (athleteLastName) athleteWhereClause.lastName = athleteLastName;
            // let athlete = await transactionalEntityManager.findOne(Athletes, {
            //   where: athleteWhereClause,
            //   select: {
            //     id: true,
            //   },
            // });

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: tour.gender,
                  playerStatus: AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });

            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  baseNonJokerLapTime: 0,
                  status: AthleteStatus.ACTIVE,
                }),
              );
            }

            const existingScore = await transactionalEntityManager.findOne(Scores, {
              where: {
                athleteId: athlete.id,
                eventId: event.id,
                roundHeatId: roundHeat.id,
                lapNumber: score.lapNumber,
              },
              select: {
                id: true,
              },
            });
            // eslint-disable-next-line unicorn/prefer-ternary
            if (existingScore) {
              await transactionalEntityManager.update(
                Scores,
                {
                  id: existingScore.id,
                },
                {
                  roundSeed: eventParticipant?.seedNo || 0,
                  lapTime: score.lapTime,
                  lapNumber: score.lapNumber,
                  notes: score.notes,
                },
              );
            } else {
              await transactionalEntityManager.save(
                this.scoresRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  roundHeatId: roundHeat.id,
                  lapTime: score.lapTime,
                  lapNumber: score.lapNumber,
                  roundSeed: eventParticipant?.seedNo || 0,
                  notes: score.notes,
                }),
              );
            }
          } catch (error) {
            throw error;
          }
        }
      },
    );

    return true;
  }

  async saveEventSeed(payload: EventSeedDto) {
    await this.eventParticipantsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          // const affectedEventIds = [];
          const insertPayload = [];
          const replacementList: IParticipantReplacement[] = [];

          // loop through and find all events that are going to be affected by the seed
          const uniqueEventObj: {
            [key: string]: {
              name: string;
              gender: string;
              year: number;
            };
          } = {};

          // create a unique key for each event using the name, gender and year
          payload.items.forEach((item) => {
            const key = `${item.eventName}_${item.gender}_${item.tourYear}`;
            if (!uniqueEventObj[key])
              uniqueEventObj[key] = {
                name: item.eventName,
                gender: item.gender,
                year: +item.tourYear,
              };
          });

          // loop through and find the unique events
          const events = await Promise.all(
            Object.values(uniqueEventObj).map(async (row) => {
              try {
                const event = await this.eventsRepository.findOne({
                  where: {
                    name: row.name,
                    tourYear: {
                      tour: {
                        gender: row.gender,
                      },
                      year: row.year,
                    },
                    isActive: true,
                    isArchived: false,
                  },
                  relations: ["tourYear.tour"],
                  select: {
                    id: true,
                    name: true,
                    tourYear: {
                      tourId: true,
                      year: true,
                      tour: {
                        id: true,
                        gender: true,
                      },
                    },
                  },
                });

                if (!event) {
                  throw eventExceptions.eventNotFound({
                    eventName: row.name,
                  });
                }

                return event;
              } catch (eventError) {
                throw eventError;
              }
            }),
          );

          // mark the participants of these events as inactive so that later on, these can be marked as active
          // that ways any that are not in use will automatically be in active
          await transactionalEntityManager.update(
            EventParticipants,
            {
              eventId: In(events.map((event) => event.id)),
            },
            {
              isActive: false,
              isArchived: true,
            },
          );

          for await (const item of payload.items) {
            try {
              // let athlete = await transactionalEntityManager.findOne(Athletes, {
              //   where: {
              //     firstName: Raw((alias) => `LOWER(${alias}) = '${item.firstName.toLowerCase()}'`),
              //     middleName: Raw(
              //       (alias) => `LOWER(${alias}) = '${item.middleName.toLowerCase()}'`,
              //     ),
              //     lastName: Raw((alias) => `LOWER(${alias}) = '${item.lastName.toLowerCase()}'`),
              //     isActive: true,
              //     isArchived: false,
              //   },
              //   select: {
              //     id: true,
              //   },
              // });
              const athleteQuery = transactionalEntityManager
                .createQueryBuilder(Athletes, "Athletes")
                .select(["id"])
                .where(`LOWER("firstName") = LOWER(:firstName)`, {
                  firstName: item.firstName,
                });
              if (item.middleName)
                athleteQuery.andWhere(`LOWER("middleName") = LOWER(:middleName)`, {
                  middleName: item.middleName,
                });
              if (item.lastName)
                athleteQuery.andWhere(`LOWER("lastName") = LOWER(:lastName)`, {
                  lastName: item.lastName,
                });
              let athlete = await athleteQuery
                .andWhere({
                  isActive: true,
                  isArchived: false,
                })
                .getRawOne();

              const event = events.find((eventRow) => {
                const eventKey = `${eventRow.name}_${eventRow.tourYear.tour.gender}_${eventRow.tourYear.year}`;
                const itemKey = `${item.eventName}_${item.gender}_${item.tourYear}`;

                return eventKey === itemKey;
              });
              if (!event) throw eventExceptions.eventNotFound(item);

              if (!athlete) {
                const insertAthlete = this.athletesRepository.create({
                  firstName: item.firstName,
                  middleName: item.middleName,
                  lastName: item.lastName,
                  gender: item.gender,
                  nationality: item.nationality,
                  playerStatus: item.playerStatus,
                  stance: item.stance,
                });
                athlete = await transactionalEntityManager.save(insertAthlete);
              } else {
                // update the data
                await transactionalEntityManager.update(
                  Athletes,
                  {
                    id: athlete.id,
                  },
                  {
                    firstName: item.firstName,
                    middleName: item.middleName,
                    lastName: item.lastName,
                    gender: item.gender,
                    nationality: item.nationality,
                    playerStatus: item.playerStatus,
                    stance: item.stance,
                    isActive: true,
                    isArchived: false,
                  },
                );
              }

              const existingEventParticipant = await transactionalEntityManager.findOne(
                EventParticipants,
                {
                  where: {
                    eventId: event.id,
                    athleteId: athlete.id,
                  },
                  select: ["id"],
                },
              );

              const isActiveParticipant = [
                AthleteStatus.ACTIVE,
                AthleteStatus.REPLACEMENT,
              ].includes(item.playerStatus);

              if (existingEventParticipant?.id) {
                // update
                await transactionalEntityManager.update(
                  EventParticipants,
                  {
                    id: existingEventParticipant.id,
                  },
                  {
                    seedNo: item.seed,
                    baseProjection: item.baseProjection,
                    // baseLapTime: item.baseLapTime,
                    soloCrashRate: item.soloCrashRate,
                    baseHeadLapTime: item.baseHeadLapTime,
                    headCrashRate: item.headCrashRate,
                    raceCrashRate: item.raceCrashRate,
                    // baseJokerLapTime: item.baseJokerLapTime,
                    baseNonJokerLapTime: item.baseNonJokerLapTime,
                    status: item.playerStatus,
                    isActive: item.seed > 0 && isActiveParticipant,
                    isArchived: item.seed <= 0 || !isActiveParticipant,
                    notes: item.notes,
                  },
                );
              } else {
                // insert
                const eventParticipant = this.eventParticipantsRepository.create({
                  eventId: event.id,
                  athleteId: athlete.id,
                  seedNo: item.seed,
                  baseProjection: item.baseProjection,
                  // baseLapTime: item.baseLapTime,
                  soloCrashRate: item.soloCrashRate,
                  baseHeadLapTime: item.baseHeadLapTime,
                  headCrashRate: item.headCrashRate,
                  raceCrashRate: item.raceCrashRate,
                  // baseJokerLapTime: item.baseJokerLapTime,
                  baseNonJokerLapTime: item.baseNonJokerLapTime,
                  status: item.playerStatus,
                  isActive: item.seed > 0 && isActiveParticipant,
                  isArchived: item.seed <= 0 || !isActiveParticipant,
                  notes: item.notes,
                });

                insertPayload.push(eventParticipant);
              }

              if (item.playerStatus === AthleteStatus.REPLACEMENT) {
                // find the injured athlete whos name is included in the notes for replacement
                const injuredAthleteRow = payload.items
                  .filter((row) => row.playerStatus === AthleteStatus.INJURED)
                  .find((row) =>
                    item.notes.includes(`${row.firstName} ${row.middleName} ${row.lastName}`),
                  );

                if (injuredAthleteRow)
                  replacementList.push({
                    injuredAthleteName: `${injuredAthleteRow.firstName} ${injuredAthleteRow.middleName} ${injuredAthleteRow.lastName}`,
                    replacementAthleteId: athlete.id,
                    eventId: event.id,
                  });
              }
            } catch (error) {
              throw error;
            }
          }

          try {
            if (insertPayload.length) await transactionalEntityManager.save(insertPayload);

            const scoresPayload = [];
            for await (const event of events) {
              try {
                const eventScores = await transactionalEntityManager.count(Scores, {
                  where: {
                    eventId: event.id,
                  },
                  select: {
                    isActive: true,
                  },
                });

                const eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    eventId: event.id,
                    round: {
                      roundNo: 1,
                    },
                  },
                  select: {
                    id: true,
                    roundId: true,
                    roundStatus: true,
                    round: {
                      id: true,
                      roundNo: true,
                    },
                  },
                  relations: ["round"],
                });

                if (!eventRound)
                  throw eventRoundExceptions.eventRoundNotFound({ EventId: event.id });

                // fetch all round heats for the current event for round 1
                const heats = await transactionalEntityManager.find(RoundHeats, {
                  where: {
                    eventId: event.id,
                    roundId: eventRound.round.id,
                  },
                  select: {
                    id: true,
                    heatNo: true,
                  },
                });

                if (heats.length)
                  // open markets for all round 1 heats
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: In(heats.map((heat) => heat.id)),
                    },
                    {
                      isHeatWinnerMarketOpen: true,
                    },
                  );
                // open markets for the event as well
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: event.id,
                  },
                  {
                    isEventWinnerMarketOpen: true,
                  },
                );

                // this event already has heats
                if (eventScores > 0) {
                  // instead of not doing anything here, the issue that occurs is the seeds can change
                  // in which case a lot changes so clear the data only if round 1 is not completed
                  if ([RoundStatus.COMPLETED].includes(eventRound.roundStatus)) {
                    // if it is completed that means that the event has already progressed and nothing to do here
                  } else {
                    // clearing all scores for the event so the data can be reinserted
                    await transactionalEntityManager.delete(Scores, {
                      eventId: event.id,
                      roundHeatId: In(heats.map((heat) => heat.id)),
                    });
                  }
                }

                const eventParticipants = await transactionalEntityManager.find(EventParticipants, {
                  where: {
                    eventId: event.id,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    athleteId: true,
                    seedNo: true,
                  },
                });

                const freePracticeHeat = await transactionalEntityManager.findOne(RoundHeats, {
                  where: {
                    eventId: event.id,
                    roundId: eventRound.round.id,
                    heatNo: 1,
                  },
                  select: {
                    id: true,
                  },
                });

                // free practise is done for 4 laps
                const lapCount: number = 3;

                for (let lap = 1; lap <= lapCount; lap++) {
                  scoresPayload.push(
                    ...eventParticipants.map((eventParticipant) =>
                      this.scoresRepository.create({
                        eventId: event.id,
                        roundHeatId: freePracticeHeat.id,
                        athleteId: eventParticipant.athleteId,
                        roundSeed: eventParticipant.seedNo,
                        lapNumber: lap,
                      }),
                    ),
                  );
                }
              } catch (error) {
                throw error;
              }
            }

            if (scoresPayload.length) await transactionalEntityManager.save(scoresPayload);
          } catch (error) {
            throw error;
          }

          // this is mainly for events that have already been seeded but not started
          // in that case the system should update the athletes in the heats in case there is an injured list
          if (replacementList.length) {
            const promises = replacementList.map(async (item) => {
              try {
                // check to see if event is not live since that is the only case where the automatic update should kick in
                const event = await this.eventsRepository.findOne({
                  where: {
                    id: item.eventId,
                  },
                  select: {
                    id: true,
                    eventStatus: true,
                  },
                });

                if (
                  [EventStatus.LIVE, EventStatus.POSTPONED, EventStatus.COMPLETED].includes(
                    event.eventStatus,
                  )
                )
                  return false;

                const eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    eventId: item.eventId,
                    round: {
                      roundNo: 1,
                    },
                  },
                  select: {
                    id: true,
                    roundId: true,
                    round: {
                      id: true,
                    },
                  },
                  relations: ["round"],
                });

                const heats = await transactionalEntityManager.find(RoundHeats, {
                  where: {
                    eventId: item.eventId,
                    roundId: eventRound.round.id,
                  },
                  select: {
                    id: true,
                  },
                });

                const nameSplit = item.injuredAthleteName.trim().split(" ");
                const athleteFirstName = nameSplit?.[0]?.trim();
                const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
                const athleteLastName =
                  nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

                const injuredAthlete = await transactionalEntityManager.findOne(Athletes, {
                  where: {
                    firstName: athleteFirstName,
                    middleName: athleteMiddleName,
                    lastName: athleteLastName,
                  },
                  select: {
                    id: true,
                  },
                });

                const score = await transactionalEntityManager.findOne(Scores, {
                  where: {
                    eventId: item.eventId,
                    roundHeatId: In(heats.map((heat) => heat.id)),
                    athleteId: injuredAthlete.id,
                  },
                  select: {
                    id: true,
                  },
                });

                // replacement is likely in place and doesn't need to be replaced
                if (!score) return false;

                await transactionalEntityManager.update(
                  Scores,
                  {
                    id: score.id,
                  },
                  {
                    athleteId: item.replacementAthleteId,
                  },
                );

                return true;
              } catch (error) {
                throw error;
              }
            });

            await Promise.all(promises);
          }

          if (events.length)
            await Promise.all(
              events.map((event) =>
                this.queueService.notifyEventUpdate({
                  eventId: event.id,
                  delaySeconds: 10,
                  sportType: SportsTypes.SUPERCROSS,
                }),
              ),
            );

          return true;
        } catch (transactionError) {
          throw transactionError;
        }
      },
    );

    return true;
  }
}
