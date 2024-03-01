import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository, FindOptionsWhere, ILike, IsNull, Not, In } from "typeorm";

import Event from "../../../../entities/sls/events.entity";
import LeagueYears from "../../../../entities/sls/leagueYears.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import Scores from "../../../../entities/sls/scores.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";

import { EventStatus } from "../../../../constants/system";
@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventParticipants)
    private readonly eventParticpantRepository: Repository<EventParticipants>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
  ) {}

  public async fetchEvents(
    limit: number = 10,
    startingAfter?: string,
    year?: number,
    eventStatuses?: string[],
    leagueId?: string,
    eventLocation?: string,
    query?: string,
  ): Promise<Event[]> {
    let where: FindOptionsWhere<Event> = {
      isActive: true,
      isArchived: false,
    };

    let eventStatusesValue = [];

    let leagueYearWhere: FindOptionsWhere<LeagueYears> = {};

    if (startingAfter)
      where = {
        id: LessThan(startingAfter),
      };

    if (year)
      leagueYearWhere = {
        year,
      };

    if (leagueId)
      leagueYearWhere = {
        ...leagueYearWhere,
        leagueId,
      };

    if (Object.keys(leagueYearWhere).length)
      where = {
        ...where,
        leagueYear: leagueYearWhere,
      };

    if (eventLocation)
      where = {
        ...where,
        eventLocation: ILike(`%${eventLocation}%`),
      };

    if (eventStatuses?.length) {
      eventStatusesValue = eventStatuses.map((eS) => EventStatus[eS]);
      where = {
        ...where,
        eventStatus: In(eventStatusesValue),
      };
    }

    let finalWhere: FindOptionsWhere<Event>[] = [where];

    if (query) {
      finalWhere = [
        {
          ...where,
          name: ILike(`%${query}%`),
        },
        {
          ...where,
          eventLocation: ILike(`%${query}%`),
        },
      ];
    }

    const events: Event[] = await this.eventRepository.find({
      relations: ["leagueYear.league"],
      select: {
        id: true,
        leagueYearId: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        leagueYear: {
          leagueId: true,
          year: true,
          league: {
            id: true,
            name: true,
          },
        },
        // rounds: {
        //   id: true,
        //   startDate: true,
        //   endDate: true,
        //   roundStatus: true,
        // },
      },
      take: limit,
      where: finalWhere,
      order: {
        id: "DESC",
      },
    });

    return events;
  }

  async fetchHeatScore(
    eventId: string,
    heatId: string,
  ): Promise<{
    scores: Scores[];
    heat: RoundHeats;
  }> {
    const [scores, heat] = await Promise.all([
      this.scoresRepository.find({
        where: {
          eventId,
          roundHeatId: heatId,
        },
        relations: ["athlete"],
        select: {
          id: true,
          roundSeed: true,
          lineScore1: true,
          lineScore2: true,
          roundScore: true,
          trick1Score: true,
          trick2Score: true,
          trick3Score: true,
          trick4Score: true,
          trick5Score: true,
          trick6Score: true,
          heatPosition: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      }),
      this.heatsRepository.findOne({
        where: {
          id: heatId,
          eventId,
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          heatNo: true,
          heatName: true,
          heatStatus: true,
          eventId: true,
          roundId: true,
        },
      }),
    ]);

    return { scores, heat };
  }

  public async fetchEventParticipants(eventId: string): Promise<EventParticipants[]> {
    const participants = await this.eventParticpantRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        seedNo: true,
        status: true,
        athlete: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          nationality: true,
          stance: true,
        },
      },
      relations: ["athlete"],
    });

    return participants;
  }

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

  public async fetchEvent(eventId?: string, year?: number, eventName?: string): Promise<Event> {
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
        leagueYear: {
          year,
        },
      };
    }

    const event: Event = await this.eventRepository.findOne({
      relations: ["leagueYear.league", "rounds.round.heats"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
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
