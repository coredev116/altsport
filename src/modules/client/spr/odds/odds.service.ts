import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import groupBy from "lodash.groupby";
import orderBy from "lodash.orderby";

import ClientPropBets from "../../../../entities/spr/clientPropBets.entity";
import ClientProjectionEventOutcome from "../../../../entities/spr/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/spr/clientProjectionEventHeatOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/spr/clientPlayerHeadToHeads.entity";
import ClientProjectionEventShows from "../../../../entities/spr/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/spr/clientProjectionEventPodiums.entity";
import Event from "../../../../entities/spr/events.entity";
import Athletes from "../../../../entities/spr/athletes.entity";
import EventParticipants from "../../../../entities/spr/eventParticipants.entity";
import RoundHeats from "../../../../entities/spr/roundHeats.entity";
import Rounds from "../../../../entities/spr/rounds.entity";

import { SportsDbSchema, OddsTableNames } from "../../../../constants/system";
import { PublicOddTypes } from "../../../../constants/odds";

import { IOddMarkets } from "../../../../interfaces/odds";

import EventHeatOddsDownloadResponse from "./schemas/response/eventHeatOddsDownload.response";
import EventShowsDownloadResponse from "./schemas/response/eventShowsDownload.response";
import EventPodiumsDownloadResponse from "./schemas/response/eventPodiumsDownload.response";
import PlayerHeadToHeadsDownloadResponse, {
  PlayerHeadToHeadsResponse,
  MatchupResponse,
  EventParticipant,
} from "./schemas/response/playerHeadToHeadsDownload.response";
import EventPropBetsDownloadResponse from "./schemas/response/eventPropBetsDownload.response";

import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(ClientPropBets)
    private readonly clientPropBetsRepository: Repository<ClientPropBets>,
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
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(RoundHeats) private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
  ) {}

  async fetchPropBets(eventId: string): Promise<ClientPropBets[]> {
    const data = await this.clientPropBetsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
        // eventParticipant: {
        //   isActive: true,
        //   isArchived: false,
        // },
      },
      relations: ["eventParticipant.athlete"],
      select: {
        id: true,
        eventParticipantId: true,
        odds: true,
        eventId: true,
        proposition: true,
        payout: true,
        voided: true,
        eventParticipant: {
          athleteId: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
      order: {
        payout: "ASC",
        voided: "ASC",
      },
    });

    return data;
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

  public async fetchEventShows(eventId: string): Promise<ClientProjectionEventShows[]> {
    const data = await this.clientProjectionEventShowsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventParticipantId: true,
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

  public async fetchEventPodiums(eventId: string): Promise<ClientProjectionEventPodiums[]> {
    const data = await this.clientProjectionEventPodiumsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventParticipantId: true,
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

  async fetchHeadToHead(id: string): Promise<ClientPlayerHeadToHeads> {
    const playerHeadToHead = await this.clientPlayerHeadToHeadsRepository.findOne({
      where: {
        id,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        eventParticipantWinnerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return playerHeadToHead;
  }

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

  public async downloadEventPodiumsOdds(eventId: string): Promise<EventPodiumsDownloadResponse> {
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

    const eventOdds = await this.clientProjectionEventPodiumsRepository.find({
      where: {
        eventId,
      },
      relations: ["participant.athlete"],
      order: {
        createdAt: "DESC",
      },
      select: {
        id: true,
        eventParticipantId: true,
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
    });

    const data = eventOdds.map((eventOdd) => {
      return {
        id: eventOdd.id,
        eventParticipantId: eventOdd.eventParticipantId,
        odds: +Number(eventOdd.odds).toFixed(2),
        probability: +Number(eventOdd.probability).toFixed(2),
        trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
        hasModifiedProbability: eventOdd.hasModifiedProbability,
        athlete: {
          id: eventOdd.participant.athlete.id,
          firstName: eventOdd.participant.athlete.firstName,
          middleName: eventOdd.participant.athlete.middleName,
          lastName: eventOdd.participant.athlete.lastName,
        },
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Supercross",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
    };
  }

  public async downloadEventShowsOdds(eventId: string): Promise<EventShowsDownloadResponse> {
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

    const eventOdds = await this.clientProjectionEventShowsRepository.find({
      where: {
        eventId,
      },
      relations: ["participant.athlete"],
      order: {
        createdAt: "DESC",
      },
      select: {
        id: true,
        eventParticipantId: true,
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
          },
        },
        createdAt: true,
      },
    });

    const data = eventOdds.map((eventOdd) => {
      return {
        id: eventOdd.id,
        eventParticipantId: eventOdd.eventParticipantId,
        odds: +Number(eventOdd.odds).toFixed(2),
        probability: +Number(eventOdd.probability).toFixed(2),
        trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
        hasModifiedProbability: eventOdd.hasModifiedProbability,
        athlete: {
          id: eventOdd.participant.athlete.id,
          firstName: eventOdd.participant.athlete.firstName,
          middleName: eventOdd.participant.athlete.middleName,
          lastName: eventOdd.participant.athlete.lastName,
        },
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Supercross",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
    };
  }

  public async downloadEventPropBets(eventId: string): Promise<EventPropBetsDownloadResponse> {
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

    const eventOdds = await this.clientPropBetsRepository.find({
      where: {
        eventId,
      },
      relations: ["eventParticipant.athlete"],
      order: {
        createdAt: "DESC",
      },
      select: {
        id: true,
        eventParticipantId: true,
        proposition: true,
        odds: true,
        probability: true,
        payout: true,
        voided: true,
        betId: true,
        eventParticipant: {
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

    const data = eventOdds.map((eventOdd) => {
      return {
        id: eventOdd.id,
        betId: eventOdd.betId,
        eventParticipantId: eventOdd.eventParticipantId,
        odds: +Number(eventOdd.odds).toFixed(2),
        probability: +Number(eventOdd.probability).toFixed(2),
        proposition: eventOdd.proposition,
        payout: eventOdd.payout,
        voided: eventOdd.voided,
        athlete: {
          id: eventOdd.eventParticipant?.athlete?.id || null,
          firstName: eventOdd.eventParticipant?.athlete?.firstName || null,
          middleName: eventOdd.eventParticipant?.athlete?.middleName || null,
          lastName: eventOdd.eventParticipant?.athlete?.lastName || null,
        },
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Supercross",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
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
      sport: "Supercross",
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
        startDate: true,
        endDate: true,
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
        athleteId: eventOdd.eventParticipants.athletes.id,
        eventParticipantId: eventOdd.eventParticipantId,
        firstName: eventOdd.eventParticipants.athletes.firstName,
        middleName: eventOdd.eventParticipants.athletes.middleName,
        lastName: eventOdd.eventParticipants.athletes.lastName,
        odds: eventOdd.odds,
        probability: eventOdd.probability,
        trueProbability: eventOdd.trueProbability,
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Superscross",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
    };
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
        "roundHeats.isHeatWinnerMarketVoided",
        "roundHeats.voidDate",
        "roundHeats.startDate",
        "roundHeats.endDate",
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
      sport: "Supercross",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      roundName: round.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      heats: data,
    };
  }

  async getMarkets(eventId: string): Promise<Partial<IOddMarkets>> {
    const result = (await this.eventRepository.query(`
    SELECT
      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.EVENT_WINNER]
    }" WHERE ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.EVENT_WINNER]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.EVENT_WINNER}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.HEAT_WINNER]
    }"  WHERE ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.HEAT_WINNER]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.HEAT_WINNER}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }"  WHERE ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.HEAD_TO_HEAD]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.HEAD_TO_HEAD}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${OddsTableNames[PublicOddTypes.SHOWS]}" WHERE ${
      SportsDbSchema.SPR
    }."${OddsTableNames[PublicOddTypes.SHOWS]}"."eventId" = '${eventId}') AS "${
      PublicOddTypes.SHOWS
    }",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.PODIUMS]
    }" WHERE ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.PODIUMS]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.PODIUMS}",

      EXISTS (SELECT 1 FROM ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.PROP_BETS]
    }" WHERE ${SportsDbSchema.SPR}."${
      OddsTableNames[PublicOddTypes.PROP_BETS]
    }"."eventId" = '${eventId}') AS "${PublicOddTypes.PROP_BETS}"
    
    `)) as IOddMarkets[];

    return result[0];
  }
}
