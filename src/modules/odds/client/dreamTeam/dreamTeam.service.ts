import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ObjectLiteral } from "typeorm";
import groupBy from "lodash.groupby";

import { SportsTypes } from "../../../../constants/system";

import { fetchSportName } from "../../../../helpers/sports.helper";

import * as systemExceptions from "../../../../exceptions/system";
import * as eventExceptions from "../../../../exceptions/events";

import F1ClientProjectionDreamTeam from "../../../../entities/f1/clientProjectionDreamTeam.entity";
import MGClientProjectionDreamTeam from "../../../../entities/mg/clientProjectionDreamTeam.entity";
import MXGPClientProjectionDreamTeam from "../../../../entities/mxgp/clientProjectionDreamTeam.entity";

import F1Events from "../../../../entities/f1/events.entity";
import MotoGPEvents from "../../../../entities/mg/events.entity";
import MXGPEvents from "../../../../entities/mxgp/events.entity";

import EventDreamTeamDownloadResponse, {
  MatchupResponse,
  DreamTeam,
} from "./schemas/response/dreamTeamDownload.response";

@Injectable()
export class DreamTeamService {
  constructor(
    @InjectRepository(F1ClientProjectionDreamTeam)
    private readonly f1ClientProjectionDreamTeamRepository: Repository<F1ClientProjectionDreamTeam>,
    @InjectRepository(F1Events)
    private readonly f1EventsRepository: Repository<F1Events>,

    @InjectRepository(MGClientProjectionDreamTeam)
    private readonly mgClientProjectionDreamTeamRepository: Repository<MGClientProjectionDreamTeam>,
    @InjectRepository(MotoGPEvents)
    private readonly motoGPEventsRepository: Repository<MotoGPEvents>,

    @InjectRepository(MXGPClientProjectionDreamTeam)
    private readonly mxgpClientProjectionDreamTeamRepository: Repository<MXGPClientProjectionDreamTeam>,
    @InjectRepository(MXGPEvents)
    private readonly mxGPRepository: Repository<MXGPEvents>,
  ) {}

  async fetchProjectionDreamTeam(
    sportType: SportsTypes,
    eventId: string,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        repository = this.f1ClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpClientProjectionDreamTeamRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionDreamTeam = await repository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      relations: ["participants"],
      select: {
        id: true,
        eventId: true,
        voided: true,
        draw: true,
        createdAt: true,
        updatedAt: true,
        participants: {
          id: true,
          team: true,
          probability: true,
          odds: true,
          trueProbability: true,
          hasModifiedProbability: true,
          participants: {},
        },
      },
      order: {
        voided: "ASC",
      },
    });

    return projectionDreamTeam;
  }

  public async downloadDreamTeamOdds(
    sportType: SportsTypes,
    eventId: string,
  ): Promise<EventDreamTeamDownloadResponse> {
    let eventRepository: Repository<ObjectLiteral>;
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        eventRepository = this.f1EventsRepository;
        repository = this.f1ClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        eventRepository = this.motoGPEventsRepository;
        repository = this.mgClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MXGP: {
        eventRepository = this.mxGPRepository;
        repository = this.mxgpClientProjectionDreamTeamRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const event = await eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        eventNumber: true,
        startDate: true,
        endDate: true,
        eventLocation: true,
        eventLocationGroup: true,
        eventStatus: true,
        tourYear: {
          year: true,
          tour: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) throw eventExceptions.eventNotFound();

    const odds = await repository.find({
      where: {
        eventId,
      },
      relations: ["participants"],
      order: {
        createdAt: "DESC",
      },
      select: {
        id: true,
        providerId: true,
        voided: true,
        draw: true,
        participants: {
          id: true,
          // dreamTeamId: true,
          participants: true,
          team: true,
          odds: true,
          probability: true,
          trueProbability: true,
          hasModifiedProbability: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const groupedMatches: {
      [key: string]: ObjectLiteral[];
    } = {};
    odds.forEach((row) => {
      const key = row.providerId;
      if (!groupedMatches[key]) groupedMatches[key] = [];

      groupedMatches[key].push(row);
    });

    const matches: MatchupResponse[] = [];
    Object.values(groupedMatches).map((rows) => {
      const obj = rows[0];

      const teamMapId: {
        [teamName: string]: string;
      } = {};

      obj.participants.forEach((participant) => {
        if (!teamMapId[participant.team]) teamMapId[participant.team] = participant.id;
      });

      const groupedPublishes = groupBy(rows, (d) => new Date(d.createdAt).toISOString());
      const publishObj: {
        [key: string]: DreamTeam;
      } = {};

      Object.keys(groupedPublishes).forEach((rowKey) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { participants } = groupedPublishes[rowKey]?.[0];

        // since all the teams of a dream team are the same, all publishes are also the same for all teams
        // so create a mapping between the team name and id so its the same for all
        const parsedParticipants = participants.map((participant) => ({
          ...participant,
          id: teamMapId[participant.team],
        }));

        publishObj[rowKey] = {
          teams: parsedParticipants,
          holdingPercentage: 100,
        };
      });

      matches.push({
        id: obj.id,
        winnerParticipantId: "",
        eventId: obj.eventId,
        voided: obj.voided,
        draw: obj.draw,
        publishes: publishObj,
        createdAt: obj.createdAt,
      });
    });

    return {
      sport: fetchSportName(sportType),
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      matchUps: matches,
    };
  }
}
