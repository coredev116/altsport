import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import groupBy from "lodash.groupby";

import Event from "../../../../entities/f1/events.entity";
import ClientPlayerHeadToHeads from "../../../../entities/f1/clientPlayerHeadToHeads.entity";

import PlayerHeadToHeadsDownloadResponse, {
  PlayerHeadToHeadsResponse,
  MatchupResponse,
  EventParticipant,
} from "./schemas/response/playerHeadToHeadsDownload.response";

import { SportsDbSchema, OddsTableNames } from "../../../../constants/system";
import { PublicOddTypes } from "../../../../constants/odds";

import { IOddMarkets } from "../../../../interfaces/odds";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
  ) {}

  async fetchEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        eventNumber: true,
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

  async fetchPlayerHeadToHeads(eventId: string): Promise<ClientPlayerHeadToHeads[]> {
    const playerHeadToHeads = await this.clientPlayerHeadToHeadsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      relations: [
        "eventParticipant1.athlete",
        "eventParticipant2.athlete",
        "eventParticipantWinner.athlete",
      ],
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        player1Position: true,
        player1Odds: true,
        player2Position: true,
        player2Odds: true,
        player1Probability: true,
        player2Probability: true,
        player1TrueProbability: true,
        player2TrueProbability: true,
        eventParticipantWinnerId: true,
        player1HasModifiedProbability: true,
        player2HasModifiedProbability: true,
        voided: true,
        draw: true,
        holdingPercentage: true,
        eventParticipant1: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipant2: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipantWinner: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      order: {
        voided: "ASC",
      },
    });

    return playerHeadToHeads;
  }

  public async downloadHeadToHeadOdds(eventId: string): Promise<PlayerHeadToHeadsDownloadResponse> {
    const event = await this.eventRepository.findOne({
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

    const playerHeadToHeads = await this.clientPlayerHeadToHeadsRepository.find({
      where: {
        eventId,
      },
      relations: ["eventParticipant1.athlete", "eventParticipant2.athlete"],
      order: {
        createdAt: "DESC",
      },
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        player1Position: true,
        player1Odds: true,
        player2Position: true,
        player2Odds: true,
        player1Probability: true,
        player2Probability: true,
        player1TrueProbability: true,
        player2TrueProbability: true,
        eventParticipantWinnerId: true,
        player1HasModifiedProbability: true,
        player2HasModifiedProbability: true,
        voided: true,
        draw: true,
        holdingPercentage: true,
        eventParticipant1: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
        eventParticipant2: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
        createdAt: true,
      },
    });

    const groupedMatches: {
      [key: string]: ClientPlayerHeadToHeads[];
    } = {};
    playerHeadToHeads.forEach((row) => {
      const key = `${row.eventParticipant1Id}_${row.eventParticipant2Id}`;
      if (!groupedMatches[key]) groupedMatches[key] = [];

      groupedMatches[key].push(row);
    });

    const matches: MatchupResponse[] = [];
    Object.values(groupedMatches).map((rows) => {
      const obj = rows[0];

      const winnerRow = rows.find((row) => row.eventParticipantWinnerId);

      const groupedPublishes = groupBy(rows, (d) => new Date(d.createdAt).toISOString());
      const publishObj: {
        [key: string]: PlayerHeadToHeadsResponse;
      } = {};

      Object.keys(groupedPublishes).forEach((rowKey) => {
        const {
          eventParticipant1,
          eventParticipant2,
          holdingPercentage,
          player1Position,
          player2Position,
          player1Odds,
          player2Odds,
          player1Probability,
          player2Probability,
          player1TrueProbability,
          player2TrueProbability,
          player1HasModifiedProbability,
          player2HasModifiedProbability,
        } =
          // eslint-disable-next-line no-unsafe-optional-chaining
          groupedPublishes[rowKey]?.[0];

        const eventParticipant1Row: EventParticipant = {
          id: eventParticipant1.id,
          position: player1Position,
          odds: +player1Odds,
          probability: +player1Probability,
          trueProbability: +player1TrueProbability,
          hasModifiedProbability: player1HasModifiedProbability,
          athlete: eventParticipant1.athlete,
        };

        const eventParticipant2Row: EventParticipant = {
          id: eventParticipant2.id,
          position: player2Position,
          odds: +player2Odds,
          probability: +player2Probability,
          trueProbability: +player2TrueProbability,
          hasModifiedProbability: player2HasModifiedProbability,
          athlete: eventParticipant2.athlete,
        };

        publishObj[rowKey] = {
          eventParticipant1: eventParticipant1Row,
          eventParticipant2: eventParticipant2Row,
          holdingPercentage: +holdingPercentage,
        };
      });

      matches.push({
        id: obj.id,
        eventId: obj.eventId,
        voided: obj.voided,
        draw: obj.draw,
        winnerParticipantId: winnerRow ? winnerRow.eventParticipantWinnerId : null,
        publishes: publishObj,
        createdAt: obj.createdAt,
      });
    });

    return {
      sport: "Formula One",
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

  async getMarkets(eventId: string): Promise<Partial<IOddMarkets>> {
    const result = (await this.eventRepository.query(`
    SELECT
      EXISTS (SELECT 1 FROM ${SportsDbSchema.F1}."${
      OddsTableNames[PublicOddTypes.DREAM_TEAM]
    }" WHERE ${SportsDbSchema.F1}."${
      OddsTableNames[PublicOddTypes.DREAM_TEAM]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.DREAM_TEAM}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.F1}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }" WHERE ${SportsDbSchema.F1}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.HEAD_TO_HEAD}"
    
    `)) as IOddMarkets[];

    return result[0];
  }
}
