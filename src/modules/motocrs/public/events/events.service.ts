import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull, Not, FindOptionsWhere } from "typeorm";

import Event from "../../../../entities/motocrs/events.entity";

@Injectable()
export default class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  public async fetchEventLocations(): Promise<Event[]> {
    const events = await this.eventRepository
      .createQueryBuilder("events")
      .select(["events.id", "events.eventLocation", "events.eventLocationGroup"])
      // .distinctOn(["events.eventLocation"])
      .where({
        isActive: true,
        isArchived: false,
        eventLocation: Not(IsNull()),
      })
      .getMany();

    return events;
  }

  public async getEvent(
    eventId?: string,
    year?: number,
    eventName?: string,
    categoryName?: string,
  ): Promise<Event> {
    let where: FindOptionsWhere<Event> = {
      isActive: true,
      isArchived: false,
    };

    if (eventId) {
      where = {
        ...where,
        id: eventId,
      };
    }

    if (year && eventName) {
      where = {
        ...where,
        name: eventName,
        tourYear: {
          year,
        },
      };
    }
    if (categoryName) {
      where = {
        ...where,
        categoryName,
      };
    }

    const event: Event = await this.eventRepository.findOne({
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
        rounds: {
          id: true,
          startDate: true,
          endDate: true,
          roundStatus: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            heats: {
              id: true,
              heatNo: true,
              heatStatus: true,
              heatName: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
      where,
    });

    return event;
  }
}
