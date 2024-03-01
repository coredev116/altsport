import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import groupBy from "lodash.groupby";
import orderBy from "lodash.orderby";

import Event from "../../../../entities/fdrift/events.entity";
import Rounds from "../../../../entities/fdrift/rounds.entity";
import Scores from "../../../../entities/fdrift/scores.entity";
import RoundHeats from "../../../../entities/fdrift/roundHeats.entity";
import EventRounds from "../../../../entities/fdrift/eventRounds.entity";
import ClientProjectionEventOutcome from "../../../../entities/fdrift/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/fdrift/clientPlayerHeadToHeads.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";
import Athletes from "../../../../entities/fdrift/athletes.entity";
import EventParticipants from "../../../../entities/fdrift/eventParticipants.entity";

import EventHeatOddsDownloadResponse from "./schemas/response/eventHeatOddsDownload.response";
import PlayerHeadToHeadsDownloadResponse, {
  PlayerHeadToHeadsResponse,
  MatchupResponse,
  EventParticipant,
} from "./schemas/response/playerHeadToHeadsDownload.response";
import { PlayerHeadToHeadsPageResponse } from "./schemas/response/playerHeadToHeads.response";

import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";

import {
  SportsDbSchema,
  OddsTableNames,
  API_SORT_ORDER,
  RoundStatus,
} from "../../../../constants/system";
import { PublicOddTypes } from "../../../../constants/odds";

import { IOddMarkets } from "../../../../interfaces/odds";
import { FDRIFTPublicStatsSortColumns } from "../../../../constants/fdrift";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(RoundHeats) private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(ClientProjectionEventOutcome)
    private readonly clientProjectionEventOutcomeRepository: Repository<ClientProjectionEventOutcome>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
    @InjectRepository(ClientProjectionEventHeatOutcome)
    private readonly clientProjectionEventHeatOutcomeRepository: Repository<ClientProjectionEventHeatOutcome>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
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

  async fetchEventMinimal(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
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

  public async fetchEventOdds(
    eventId: string,
    position: number,
  ): Promise<ClientProjectionEventOutcome[]> {
    const data = await this.clientProjectionEventOutcomeRepository.find({
      where: {
        eventId,
        position,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventParticipantId: true,
        position: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participant: {
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            nationality: true,
            stance: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: ["participant.athlete"],
    });

    return data;
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

  async fetchPlayerHeadToHeadsPagination(
    eventId: string,
    page: number = 1,
    athleteQuery?: string,
    sortColumnName?: FDRIFTPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ): Promise<PlayerHeadToHeadsPageResponse> {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let whereQuery: any = {
      eventId,
      isActive: true,
      isArchived: false,
    };

    if (athleteQuery)
      whereQuery = [
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
      ];

    let query: any = {
      where: whereQuery,
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
      skip,
      take: limit,
    };

    if (sortColumnName && sortOrder) {
      query = {
        ...query,
        order: {
          [sortColumnName]: sortOrder,
        },
      };
    }

    const playerHeadToHeads = await this.clientPlayerHeadToHeadsRepository.find(query);
    const countQuery = query;
    delete countQuery.skip;
    delete countQuery.take;
    const total = await this.clientPlayerHeadToHeadsRepository.count(countQuery);

    const parsedResult = playerHeadToHeads.map((row) => {
      return {
        id: row.id,
        startDate: null,
        eventId: row.eventId,
        voided: row.voided,
        draw: row.draw,
        holdingPercentage: +row.holdingPercentage,
        eventParticipant1: {
          id: row.eventParticipant1.id,
          position: row.player1Position,
          odds: +Number(row.player1Odds).toFixed(2),
          probability: +Number(row.player1Probability).toFixed(2),
          trueProbability: +Number(row.player1TrueProbability).toFixed(2),
          hasModifiedProbability: row.player1HasModifiedProbability,
          athlete: {
            id: row.eventParticipant1.athlete.id,
            firstName: row.eventParticipant1.athlete.firstName,
            middleName: row.eventParticipant1.athlete.middleName,
            lastName: row.eventParticipant1.athlete.lastName,
            nationality: row.eventParticipant1.athlete.nationality,
            stance: row.eventParticipant1.athlete.stance,
            seedNo: row.eventParticipant1.seedNo,
          },
        },
        eventParticipant2: {
          id: row.eventParticipant2.id,
          position: row.player2Position,
          odds: +Number(row.player2Odds).toFixed(2),
          probability: +Number(row.player2Probability).toFixed(2),
          trueProbability: +Number(row.player2TrueProbability).toFixed(2),
          hasModifiedProbability: row.player2HasModifiedProbability,
          athlete: {
            id: row.eventParticipant2.athlete.id,
            firstName: row.eventParticipant2.athlete.firstName,
            middleName: row.eventParticipant2.athlete.middleName,
            lastName: row.eventParticipant2.athlete.lastName,
            nationality: row.eventParticipant2.athlete.nationality,
            stance: row.eventParticipant2.athlete.stance,
            seedNo: row.eventParticipant2.seedNo,
          },
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        winnerParticipantId: row.eventParticipantWinnerId,
      };
    });

    return {
      data: parsedResult,
      total: Math.round(total / pageSize),
      page,
    };
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

  public async fetchHeatOdds(eventId: string): Promise<ClientProjectionEventHeatOutcome[]> {
    const data = await this.clientProjectionEventHeatOutcomeRepository.find({
      select: {
        id: true,
        eventId: true,
        eventParticipantId: true,
        roundHeatId: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participant: {
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            nationality: true,
            stance: true,
          },
        },
        heat: {
          id: true,
          heatName: true,
          heatNo: true,
          startDate: true,
          isHeatWinnerMarketVoided: true,
          isHeatWinnerMarketOpen: true,
          winnerAthleteId: true,
          heatStatus: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            eventRounds: {
              id: true,
              roundId: true,
              roundStatus: true,
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: {
        eventId,
        participant: {
          eventId,
        },
        heat: {
          eventId,
          round: {
            eventRounds: {
              eventId,
            },
          },
        },
        isActive: true,
        isArchived: false,
      },
      relations: ["heat.round.eventRounds", "participant.athlete"],
    });

    return data;
  }

  public async downloadHeatOdds(
    eventId: string,
    roundId: string,
  ): Promise<EventHeatOddsDownloadResponse> {
    const [event, round] = await Promise.all([
      this.eventRepository.findOne({
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
      }),
      this.roundsRepository.findOne({
        where: {
          id: roundId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    if (!event) throw eventExceptions.eventNotFound();

    if (!round) throw roundExceptions.roundNotFound();

    let data: any = await this.roundHeatsRepository
      .createQueryBuilder("roundHeats")
      .andWhere("roundHeats.eventId = :eventId", {
        eventId,
      })
      .andWhere("roundHeats.roundId = :roundId", {
        roundId,
      })
      .leftJoinAndMapMany(
        "roundHeats.clientProjectionEventHeatOutcome",
        ClientProjectionEventHeatOutcome,
        "clientProjectionEventHeatOutcome",
        "roundHeats.id = clientProjectionEventHeatOutcome.roundHeatId",
      )
      .leftJoinAndMapOne(
        "clientProjectionEventHeatOutcome.eventParticipants",
        EventParticipants,
        "eventParticipants",
        "clientProjectionEventHeatOutcome.eventParticipantId = eventParticipants.id",
      )
      .leftJoinAndMapOne(
        "eventParticipants.athletes",
        Athletes,
        "athletes",
        "eventParticipants.athleteId = athletes.id",
      )
      .select([
        "roundHeats.id",
        "roundHeats.winnerAthleteId",
        "roundHeats.heatName",
        "roundHeats.heatNo",
        "roundHeats.heatStatus",
        "roundHeats.voidDate",
        "roundHeats.startDate",
        "roundHeats.endDate",
        "roundHeats.isHeatWinnerMarketVoided",
        "clientProjectionEventHeatOutcome.id",
        "clientProjectionEventHeatOutcome.eventParticipantId",
        "clientProjectionEventHeatOutcome.odds",
        "clientProjectionEventHeatOutcome.trueProbability",
        "clientProjectionEventHeatOutcome.probability",
        "clientProjectionEventHeatOutcome.createdAt",
        "eventParticipants.seedNo",
        "athletes.id",
        "athletes.firstName",
        "athletes.middleName",
        "athletes.lastName",
      ])
      .getMany();

    data = data.map((roundHeat) => {
      roundHeat.clientProjectionEventHeatOutcome = roundHeat.clientProjectionEventHeatOutcome.map(
        (heatOdd) => {
          return {
            id: heatOdd.id,
            athleteId: heatOdd.eventParticipants.athletes.id,
            eventParticipantId: heatOdd.eventParticipantId,
            firstName: heatOdd.eventParticipants.athletes.firstName,
            middleName: heatOdd.eventParticipants.athletes.middleName,
            lastName: heatOdd.eventParticipants.athletes.lastName,
            odds: heatOdd.odds,
            probability: heatOdd.probability,
            trueProbability: heatOdd.trueProbability,
            createdAt: heatOdd.createdAt,
          };
        },
      );

      roundHeat.clientProjectionEventHeatOutcome = orderBy(
        roundHeat.clientProjectionEventHeatOutcome,
        ["createdAt"],
        "desc",
      );

      roundHeat.publishes = groupBy(roundHeat.clientProjectionEventHeatOutcome, (d) =>
        new Date(d.createdAt).toISOString(),
      );

      return {
        id: roundHeat.id,
        heatWinnerAthleteId: roundHeat.winnerAthleteId,
        name: roundHeat.heatName,
        heatNo: roundHeat.heatNo,
        heatStatus: roundHeat.heatStatus,
        isHeatWinnerMarketVoided: roundHeat.isHeatWinnerMarketVoided,
        voidDate: roundHeat.voidDate,
        startDate: roundHeat.startDate,
        endDate: roundHeat.endDate,
        publishes: roundHeat.publishes,
      };
    });

    return {
      sport: "Formula Drift",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      roundName: round.name,
      heats: data,
    };
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
      sport: "World Surf League",
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

  public async downloadEventOdds(eventId: string, position: number) {
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

    let data: any = await this.clientProjectionEventOutcomeRepository
      .createQueryBuilder("clientProjectionEventOutcome")
      .andWhere("clientProjectionEventOutcome.eventId = :eventId", {
        eventId,
      })
      .andWhere("clientProjectionEventOutcome.position = :position", {
        position,
      })
      .leftJoinAndMapOne(
        "clientProjectionEventOutcome.eventParticipants",
        EventParticipants,
        "eventParticipants",
        "clientProjectionEventOutcome.eventParticipantId = eventParticipants.id",
      )
      .leftJoinAndMapOne(
        "eventParticipants.athletes",
        Athletes,
        "athletes",
        "eventParticipants.athleteId = athletes.id",
      )
      .select([
        "clientProjectionEventOutcome.id",
        "clientProjectionEventOutcome.eventParticipantId",
        "clientProjectionEventOutcome.odds",
        "clientProjectionEventOutcome.trueProbability",
        "clientProjectionEventOutcome.probability",
        "clientProjectionEventOutcome.createdAt",
        "eventParticipants.seedNo",
        "athletes.id",
        "athletes.firstName",
        "athletes.middleName",
        "athletes.lastName",
      ])
      .orderBy("clientProjectionEventOutcome.createdAt", "DESC")
      .getMany();

    data = data.map((eventOdd) => {
      return {
        id: eventOdd.id,
        athleteId: eventOdd.eventParticipants?.athletes?.id,
        eventParticipantId: eventOdd.eventParticipantId,
        firstName: eventOdd.eventParticipants?.athletes?.firstName,
        middleName: eventOdd.eventParticipants?.athletes?.middleName,
        lastName: eventOdd.eventParticipants?.athletes?.lastName,
        odds: eventOdd.odds,
        probability: eventOdd.probability,
        trueProbability: eventOdd.trueProbability,
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Formula Drift",
      startDate: event.startDate,
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
    };
  }

  async getMarkets(eventId: string): Promise<Partial<IOddMarkets>> {
    const result = (await this.eventRepository.query(`
    SELECT
      EXISTS (SELECT 1 FROM ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.EVENT_WINNER]
    }" WHERE ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.EVENT_WINNER]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.EVENT_WINNER}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.HEAT_WINNER]
    }"  WHERE ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.HEAT_WINNER]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.HEAT_WINNER}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }"  WHERE ${SportsDbSchema.FDRIFT}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.HEAD_TO_HEAD}"
    
    `)) as IOddMarkets[];

    return result[0];
  }
}
