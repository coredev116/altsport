import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { parse, isBefore, startOfDay, endOfDay } from "date-fns";

import Events from "../../../../entities/ja/events.entity";
import TourYears from "../../../../entities/ja/tourYears.entity";
import Tours from "../../../../entities/ja/tours.entity";

import EventsResponse from "./schemas/responses/events.response";

import { EventStatus, SportsTypes } from "../../../../constants/system";

@Injectable()
export default class EventService {
  constructor(@InjectRepository(Events) private readonly eventsRepository: Repository<Events>) {}

  async fetchEvents(eventStatus: EventStatus[]): Promise<EventsResponse[]> {
    const queryBuilder = this.eventsRepository.createQueryBuilder("events");

    // Check if eventStatusValues array is provided and not empty
    if (eventStatus && eventStatus.length > 0) {
      queryBuilder.andWhere(`events."eventStatus" IN (:...eventStatus)`, {
        eventStatus,
      });
    }

    const [jaLiveEventDates, events] = await Promise.all([
      this.eventsRepository
        .createQueryBuilder("events")
        .select([`to_char(events."startDate", 'MM-DD-YYYY') as "date"`])
        .andWhere(`events."eventStatus" IN (:...eventStatus)`, {
          eventStatus: [EventStatus.LIVE],
        })
        .groupBy(`to_char(events."startDate", 'MM-DD-YYYY')`)
        .getRawMany(),

      queryBuilder
        .select([
          `to_char(events."startDate", 'DD_Month') as "month"`,
          `to_char(events."startDate", 'MM-DD-YYYY') as "date"`,
          'count(*) as "matches"',
          'years."year" as year',
          'tours."name"',
        ])
        .leftJoin(TourYears, "years", "events.tourYearId = years.id")
        .leftJoin(Tours, "tours", "years.tourId = tours.id")
        .groupBy(
          `to_char(events."startDate", 'DD_Month'), to_char(events."startDate", 'MM-DD-YYYY'), years."year", tours."name"`,
        )
        .getRawMany(),
    ]);

    const now: Date = new Date();

    const eventsData = events
      .filter((row) => row)
      .map((row) => {
        const eventArr: string[] = row.month.trim().split("_");
        const eventName: string = `${eventArr[1]} ${+eventArr[0]} (1 game)`;
        // const eventName: string = `${eventArr[1]} ${+eventArr[0]} (${row.matches} games)`;

        const parsedDate: Date = parse(row.date, "MM-dd-yyyy", new Date());

        const isLive = jaLiveEventDates.some((eventRow) => {
          return eventRow.date === row.date;
        });

        let localEventStatus: EventStatus;

        if (isLive) localEventStatus = EventStatus.LIVE;
        else {
          const isDateBefore = isBefore(parsedDate, now);
          localEventStatus = isDateBefore ? EventStatus.COMPLETED : EventStatus.UPCOMING;
        }

        return {
          id: row.date,
          sportType: SportsTypes.JA,
          name: eventName,
          eventStatus: localEventStatus,
          eventNumber: null,
          eventLocation: null,
          eventLocationGroup: null,
          year: row.year,
          tour: {
            name: row.name,
          },
          startDate: startOfDay(parsedDate),
          endDate: endOfDay(parsedDate),
        };
      });

    return eventsData;
  }
}
