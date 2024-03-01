import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Event from "../../../../entities/spr/events.entity";
import Tour from "../../../../entities/spr/tours.entity";

import EventDto from "./dto/events.dto";

import * as tourExceptions from "../../../../exceptions/tours";

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
                    categoryName: item.categoryName,
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

          return [...events, ...newEvents];
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
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
      },
    });

    return event;
  }
}
