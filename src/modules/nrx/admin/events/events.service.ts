import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, Not, In } from "typeorm";

import Event from "../../../../entities/nrx/events.entity";
import Tour from "../../../../entities/nrx/tours.entity";
import TourYear from "../../../../entities/nrx/tourYears.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";

import EventDto from "./dto/events.dto";
import UpdateEventDto from "./dto/updateEvent.dto";

import { NRXEventCategoryType, RoundStatus, EventStatus } from "../../../../constants/system";

import * as tourExceptions from "../../../../exceptions/tours";

@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(EventRounds)
    private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats)
    private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
  ) {}

  async createEvent(body: EventDto): Promise<Event[]> {
    try {
      const result = await this.tourRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const eventsPayload = [];
          const newEventsPayload = [];
          for await (const item of body.items) {
            try {
              const tour = await transactionalEntityManager.findOne(Tour, {
                where: { name: item.tourName, gender: item.gender },
                relations: ["years"],
                select: {
                  id: true,
                  years: true,
                },
              });
              if (!tour) throw tourExceptions.tourNotFound(item);

              const year = tour?.years?.find((tourYear) => tourYear.year === item.year);
              if (!year) throw tourExceptions.tourYearNotFound;

              const event = await transactionalEntityManager.findOne(Event, {
                where: { name: item.name, tourYearId: year.id, eventLocation: item.eventLocation },
              });

              if (event) {
                eventsPayload.push(
                  this.eventRepository.create({
                    ...event,
                    ...item,
                    tourYearId: year.id,
                  }),
                );
              } else {
                newEventsPayload.push(
                  this.eventRepository.create({
                    ...item,
                    tourYearId: year.id,
                    categoryName: NRXEventCategoryType.GROUP_E,
                    eventLocationGroup: item.eventLocationGroup || item.eventLocation,
                  }),
                );
              }
            } catch (error) {
              throw error;
            }
          }

          const events = await transactionalEntityManager.save(eventsPayload);
          const newEvents = await transactionalEntityManager.save(newEventsPayload);

          /* const oddDerivatives = await transactionalEntityManager.find(OddDerivatives, {
            where: {
              isActive: true,
              isArchived: false,
            },
          });
          const eventOddDerivates = [];

          newEvents.forEach((event) => {
            eventOddDerivates.push(
              this.eventOddDerivativesRespository.create({
                eventId: event.id,
                oddDerivativeId: oddDerivatives.find((oD) => oD.type === Derivatives.EVENT_WINNER)
                  .id,
                holdingPercentage: 100,
              }),
            );
            eventOddDerivates.push(
              this.eventOddDerivativesRespository.create({
                eventId: event.id,
                oddDerivativeId: oddDerivatives.find(
                  (oD) => oD.type === Derivatives.EVENT_SECOND_PLACE,
                ).id,
                holdingPercentage: 100,
              }),
            );
            eventOddDerivates.push(
              this.eventOddDerivativesRespository.create({
                eventId: event.id,
                oddDerivativeId: oddDerivatives.find((oD) => oD.type === Derivatives.HEAT_WINNER)
                  .id,
                holdingPercentage: 100,
              }),
            );
            eventOddDerivates.push(
              this.eventOddDerivativesRespository.create({
                eventId: event.id,
                oddDerivativeId: oddDerivatives.find((oD) => oD.type === Derivatives.HEAT_WINNER)
                  .id,
                holdingPercentage: 100,
              }),
            );
          });

          await transactionalEntityManager.save(eventOddDerivates); */

          return [...events, ...newEvents];
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(eventId: string, updateObj: UpdateEventDto): Promise<boolean> {
    return this.eventRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const tourYear = await transactionalEntityManager.findOne(TourYear, {
          where: { id: updateObj.tourYearId },
        });
        if (!tourYear) throw tourExceptions.tourYearNotFound;

        await transactionalEntityManager.update(
          Event,
          {
            id: eventId,
          },
          updateObj,
        );

        return true;
      },
    );
  }

  async fetchEvents(eventStatus: EventStatus[]): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: {
        eventStatus: In(eventStatus),
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventNumber: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        isSimulationEnabled: true,
        tourYear: {
          id: true,
          year: true,
          tourId: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
      },
    });

    return events;
  }

  async fetchEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
        rounds: {
          round: {
            // intentionally skipping this one out
            name: Not("Free Practice 1"),
          },
        },
      },
      relations: ["tourYear.tour", "rounds.round.heats"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventNumber: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        isSimulationEnabled: true,
        tourYear: {
          year: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
        rounds: {
          id: true,
          eventId: true,
          roundId: true,
          roundStatus: true,
          startDate: true,
          endDate: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            heats: {
              id: true,
              eventId: true,
              heatName: true,
              heatNo: true,
              heatStatus: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
    });

    return event;
  }

  async fetchEventMinimal(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        winnerAthleteId: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        isSimulationEnabled: true,
      },
    });

    return event;
  }

  public async fetchEventPositionParticipant(eventId: string, position: number): Promise<string> {
    // find the last round for the given event
    const lastEventRound = await this.eventRoundsRepository.findOne({
      where: {
        eventId,
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
      order: {
        round: {
          roundNo: "DESC",
        },
      },
    });
    if (!lastEventRound) return null;
    if (lastEventRound.roundStatus !== RoundStatus.COMPLETED) return null;

    const heat = await this.roundHeatsRepository.findOne({
      where: {
        eventId,
        roundId: lastEventRound.roundId,
      },
      select: {
        id: true,
      },
    });
    if (!heat) return null;

    const score = await this.scoresRepository.findOne({
      where: {
        roundHeatId: heat.id,
        eventId,
        heatPosition: position,
      },
      select: {
        athleteId: true,
      },
    });
    if (!score) return null;

    return score.athleteId;
  }
}
