import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In } from "typeorm";

import Event from "../../../../entities/f1/events.entity";
import Tour from "../../../../entities/f1/tours.entity";
import TourYear from "../../../../entities/f1/tourYears.entity";

import EventDto from "./dto/events.dto";
import UpdateEventDto from "./dto/updateEvent.dto";

import * as tourExceptions from "../../../../exceptions/tours";

import { EventStatus } from "../../../../constants/system";

@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
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
          year: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
      },
    });

    return event;
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

  async fetchEventMinimal(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
      },
    });

    return event;
  }
}
