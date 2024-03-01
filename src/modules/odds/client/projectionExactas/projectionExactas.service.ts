import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ObjectLiteral, IsNull, Not } from "typeorm";
import groupBy from "lodash.groupby";

import { SportsTypes, ExactasType } from "../../../../constants/system";

import { fetchSportName } from "../../../../helpers/sports.helper";

import * as systemExceptions from "../../../../exceptions/system";
import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";

import MOTOCRSClientProjectionExactas from "../../../../entities/motocrs/clientProjectionExactas.entity";
import MOTOCRSRoundHeats from "../../../../entities/motocrs/roundHeats.entity";

import ProjectionExactas from "../../../../entities/common/projectionExactas.entity";

import MOTOCRSEvents from "../../../../entities/motocrs/events.entity";
import MOTOCRSRounds from "../../../../entities/motocrs/rounds.entity";

import EventExactasDownloadResponse, {
  MatchupResponse,
  Exactas,
} from "./schemas/response/projectionExactasDownload.response";

import EventExactasHeatDownloadResponse, {
  HeatExactas,
  RoundHeats,
  MatchupResponse as HeatsMatchupResponse,
} from "./schemas/response/projectionExactasHeatDownload.response";

@Injectable()
export class ExactasService {
  constructor(
    @InjectRepository(MOTOCRSClientProjectionExactas)
    private readonly motocrsClientProjectionExactasRepository: Repository<MOTOCRSClientProjectionExactas>,
    @InjectRepository(MOTOCRSEvents)
    private readonly motocrsEventsRepository: Repository<MOTOCRSEvents>,
    @InjectRepository(MOTOCRSRounds)
    private readonly motocrsRoundsRepository: Repository<MOTOCRSRounds>,
  ) {}

  async fetchProjectionExactas(
    sportType: SportsTypes,
    eventId: string,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionExactas = await repository.find({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
      },
    });

    return projectionExactas;
  }

  async fetchProjectionExactasHeat(
    sportType: SportsTypes,
    eventId: string,
    exactasType: ExactasType,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionExactas = await repository.find({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
        position: exactasType,
        visible: true,
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
      relations: ["heat.round.eventRounds"],
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
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
      },
    });

    return projectionExactas;
  }

  public async downloadExactasOdds(
    sportType: SportsTypes,
    eventId: string,
    exactasType: ExactasType,
  ): Promise<EventExactasDownloadResponse> {
    let eventRepository: Repository<ObjectLiteral>;
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        eventRepository = this.motocrsEventsRepository;
        repository = this.motocrsClientProjectionExactasRepository;
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

    const exactas = await repository.find({
      where: {
        eventId,
        roundHeatId: IsNull(),
        position: exactasType,
        visible: true,
      },
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    const groupedMatches: {
      [key: string]: ObjectLiteral[];
    } = {};
    exactas.forEach((row) => {
      let key = "";
      row.participants.map((p) => {
        key = key + p.eventParticipantId;
      });

      if (!groupedMatches[key]) groupedMatches[key] = [];

      groupedMatches[key].push(row);
    });

    const matches: MatchupResponse[] = [];
    Object.values(groupedMatches).map((rows) => {
      const obj = rows[0];

      const groupedPublishes = groupBy(rows, (d) => new Date(d.createdAt).toISOString());
      const publishObj: {
        [key: string]: Exactas;
      } = {};

      Object.keys(groupedPublishes).forEach((rowKey) => {
        /* eslint-disable no-unsafe-optional-chaining */
        const {
          voided,
          draw,
          holdingPercentage,
          odds,
          probability,
          trueProbability,
          hasModifiedProbability,
          participants,
        } = groupedPublishes[rowKey]?.[0];

        publishObj[rowKey] = {
          id: rows[0].id,
          participants,
          voided,
          draw,
          holdingPercentage,
          odds,
          probability,
          trueProbability,
          hasModifiedProbability,
        };
      });

      matches.push({
        eventId: obj.eventId,
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

  public async downloadExactasOddsHeat(
    sportType: SportsTypes,
    eventId: string,
    roundId: string,
    exactasType: ExactasType,
  ): Promise<EventExactasHeatDownloadResponse> {
    let eventRepository: Repository<ObjectLiteral>;
    let repository: Repository<ProjectionExactas>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        eventRepository = this.motocrsEventsRepository;
        repository = this.motocrsClientProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const [event, round] = await Promise.all([
      eventRepository.findOne({
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
      this.motocrsRoundsRepository.findOne({
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

    const exactas: ProjectionExactas[] = await repository.find({
      where: {
        eventId,
        roundHeatId: Not(IsNull()),
        position: exactasType,
        visible: true,
        heat: {
          eventId,
          round: {
            id: roundId,
            eventRounds: {
              eventId,
            },
          },
        },
      },
      relations: ["heat.round.eventRounds"],
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
        heat: {
          id: true,
          heatName: true,
          heatNo: true,
          startDate: true,
          endDate: true,
          voidDate: true,
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
      },
      order: {
        createdAt: "DESC",
      },
    });

    // initial grouping is based on heats and within heats
    // the data is grouped based on matchups
    const groupedHeats: {
      [key: string]: MOTOCRSRoundHeats;
    } = {};
    exactas.forEach((row) => {
      if (!groupedHeats[row.heat.id]) {
        groupedHeats[row.heat.id] = row.heat as MOTOCRSRoundHeats;
      }
    });

    const heats: RoundHeats[] = Object.keys(groupedHeats).map((heatKey) => {
      const heatData = groupedHeats[heatKey];

      const groupedMatches: {
        [key: string]: ProjectionExactas[];
      } = {};
      exactas
        // filter based on the heat
        .filter((row) => row.roundHeatId === heatKey)
        .forEach((row) => {
          const key: string = row.participants
            .map((participantRow) => participantRow.eventParticipantId)
            .join("_");
          if (!groupedMatches[key]) groupedMatches[key] = [];

          groupedMatches[key].push(row);
        });

      const matches: HeatsMatchupResponse[] = [];
      Object.values(groupedMatches).map((rows) => {
        const obj = rows[0];

        const groupedPublishes = groupBy(rows, (d) => new Date(d.createdAt).toISOString());
        const publishObj: {
          [key: string]: HeatExactas;
        } = {};

        Object.keys(groupedPublishes).forEach((rowKey) => {
          /* eslint-disable no-unsafe-optional-chaining */
          const {
            voided,
            draw,
            holdingPercentage,
            odds,
            probability,
            trueProbability,
            hasModifiedProbability,
            participants,
          } = groupedPublishes[rowKey]?.[0];

          publishObj[rowKey] = {
            participants,
            voided,
            draw,
            holdingPercentage,
            odds,
            probability,
            trueProbability,
            hasModifiedProbability,
          };
        });

        matches.push({
          id: obj.id,
          eventId,
          publishes: publishObj,
          createdAt: obj.createdAt,
        });
      });

      return {
        id: heatData.id,
        name: heatData.heatName,
        heatNo: heatData.heatNo,
        startDate: heatData.startDate,
        endDate: heatData.endDate,
        isHeatWinnerMarketVoided: heatData.isHeatWinnerMarketVoided,
        voidDate: heatData.voidDate,
        heatStatus: heatData.heatStatus,
        matchUps: matches,
      };
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
      roundName: round.name,
      heats,
    };
  }
}
