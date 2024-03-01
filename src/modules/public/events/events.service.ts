import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, IsNull, Not } from "typeorm";
import groupBy from "lodash.groupby";

import WslEvent from "../../../entities/wsl/events.entity";
import SlsEvent from "../../../entities/sls/events.entity";
import NrxEvent from "../../../entities/nrx/events.entity";
import SprEvent from "../../../entities/spr/events.entity";
import MotocrsEvent from "../../../entities/motocrs/events.entity";
import FdriftEvent from "../../../entities/fdrift/events.entity";
import MaslEvent from "../../../entities/masl/events.entity";
import F1Event from "../../../entities/f1/events.entity";
import MGEvent from "../../../entities/mg/events.entity";

import F1ProjectionDreamTeam from "../../../entities/f1/projectionDreamTeam.entity";
import MGProjectionDreamTeam from "../../../entities/mg/projectionDreamTeam.entity";
import MXGPProjectionDreamTeam from "../../../entities/mxgp/projectionDreamTeam.entity";

import WslScore from "../../../entities/wsl/scores.entity";
import SlsScore from "../../../entities/sls/scores.entity";
import NrxScore from "../../../entities/nrx/scores.entity";
import SprScore from "../../../entities/spr/scores.entity";

import WslRoundHeat from "../../../entities/wsl/roundHeats.entity";
import SlsRoundHeat from "../../../entities/sls/roundHeats.entity";
import NrxRoundHeat from "../../../entities/nrx/roundHeats.entity";
import SprRoundHeat from "../../../entities/spr/roundHeats.entity";

import WslClientProjectionEventOutcome from "../../../entities/wsl/clientProjectionEventOutcome.entity";
import SlsClientProjectionEventOutcome from "../../../entities/sls/clientProjectionEventOutcome.entity";
import NrxClientProjectionEventOutcome from "../../../entities/nrx/clientProjectionEventOutcome.entity";
import SprClientProjectionEventOutcome from "../../../entities/spr/clientProjectionEventOutcome.entity";
import MotocrsClientProjectionEventOutcome from "../../../entities/motocrs/clientProjectionEventOutcome.entity";
import FdriftClientProjectionEventOutcome from "../../../entities/fdrift/clientProjectionEventOutcome.entity";

import WslClientProjectionEventHeatOutcome from "../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import SlsClientProjectionEventHeatOutcome from "../../../entities/sls/clientProjectionEventHeatOutcome.entity";
import NrxClientProjectionEventHeatOutcome from "../../../entities/nrx/clientProjectionEventHeatOutcome.entity";
import SprClientProjectionEventHeatOutcome from "../../../entities/spr/clientProjectionEventHeatOutcome.entity";
import MotocrsClientProjectionEventHeatOutcome from "../../../entities/motocrs/clientProjectionEventHeatOutcome.entity";
import FdriftClientProjectionEventHeatOutcome from "../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";

import WslClientPropBets from "../../../entities/wsl/clientPropBets.entity";
import SlsClientPropBets from "../../../entities/sls/clientPropBets.entity";
import NrxClientPropBets from "../../../entities/nrx/clientPropBets.entity";
import SprClientPropBets from "../../../entities/spr/clientPropBets.entity";
import MotocrsClientPropBets from "../../../entities/motocrs/clientPropBets.entity";

import WslClientPlayerHeadToHeads from "../../../entities/wsl/clientPlayerHeadToHeads.entity";
import SlsClientPlayerHeadToHeads from "../../../entities/sls/clientPlayerHeadToHeads.entity";
import NrxClientPlayerHeadToHeads from "../../../entities/nrx/clientPlayerHeadToHeads.entity";
import SprClientPlayerHeadToHeads from "../../../entities/spr/clientPlayerHeadToHeads.entity";
import MotocrsClientPlayerHeadToHeads from "../../../entities/motocrs/clientPlayerHeadToHeads.entity";
import FdriftClientPlayerHeadToHeads from "../../../entities/fdrift/clientPlayerHeadToHeads.entity";
import F1ClientPlayerHeadToHeads from "../../../entities/f1/clientPlayerHeadToHeads.entity";
import MGClientPlayerHeadToHeads from "../../../entities/mg/clientPlayerHeadToHeads.entity";

import NrxClientProjectionEventPodiums from "../../../entities/nrx/clientProjectionEventPodiums.entity";
import SprClientProjectionEventPodiums from "../../../entities/spr/clientProjectionEventPodiums.entity";
import MotocrsClientProjectionEventPodiums from "../../../entities/motocrs/clientProjectionEventPodiums.entity";
import WslClientProjectionEventPodiums from "../../../entities/wsl/clientProjectionEventPodiums.entity";
import SlsClientProjectionEventPodiums from "../../../entities/sls/clientProjectionEventPodiums.entity";

import NrxClientProjectionEventShows from "../../../entities/nrx/clientProjectionEventShows.entity";
import SprClientProjectionEventShows from "../../../entities/spr/clientProjectionEventShows.entity";
import WslClientProjectionEventShows from "../../../entities/wsl/clientProjectionEventShows.entity";
import SlsClientProjectionEventShows from "../../../entities/sls/clientProjectionEventShows.entity";

import MOTOCRSProjectionExactas from "../../../entities/motocrs/projectionExactas.entity";

import * as heatExceptions from "../../../exceptions/heats";
import * as systemExceptions from "../../../exceptions/system";

import { ExactasType } from "../../../constants/system";

import EventResponse from "./schemas/response/event.response";
import EventHeatOddsResponse from "./docs/eventHeadOdds.response";
import { EventOddsResponse } from "./docs/eventOdds.response";
import ProjectionExactasHeatResponse from "./docs/projectionExactasHeat.response";

import {
  SportsDbSchema,
  EventStatus,
  HeatStatus,
  RoundStatus,
  SportsTypes,
} from "../../../constants/system";

import { PublicOddTypes, OddMarketStatus, BetStatus } from "../../../constants/odds";

import { RoundScoreResponse } from "./docs/scoresResponse";

@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(WslEvent) private readonly wslEventRepository: Repository<WslEvent>,
    @InjectRepository(SlsEvent) private readonly slsEventRepository: Repository<SlsEvent>,
    @InjectRepository(NrxEvent) private readonly nrxEventRepository: Repository<NrxEvent>,
    @InjectRepository(SprEvent) private readonly sprEventRepository: Repository<SprEvent>,
    @InjectRepository(MotocrsEvent)
    private readonly motocrsEventRepository: Repository<MotocrsEvent>,
    @InjectRepository(FdriftEvent) private readonly fdriftEventRepository: Repository<FdriftEvent>,
    @InjectRepository(MaslEvent) private readonly maslEventRepository: Repository<MaslEvent>,
    @InjectRepository(F1Event) private readonly f1EventRepository: Repository<F1Event>,
    @InjectRepository(MGEvent) private readonly mgEventRepository: Repository<MGEvent>,

    @InjectRepository(WslScore) private readonly wslScoreRepository: Repository<WslScore>,
    @InjectRepository(SlsScore) private readonly slsScoreRepository: Repository<SlsScore>,
    @InjectRepository(NrxScore) private readonly nrxScoreRepository: Repository<NrxScore>,
    @InjectRepository(SprScore) private readonly sprScoreRepository: Repository<SprScore>,

    @InjectRepository(WslRoundHeat) private readonly wslHeatRepository: Repository<WslRoundHeat>,
    @InjectRepository(SlsRoundHeat) private readonly slsHeatRepository: Repository<SlsRoundHeat>,
    @InjectRepository(NrxRoundHeat) private readonly nrxHeatRepository: Repository<NrxRoundHeat>,
    @InjectRepository(SprRoundHeat) private readonly sprHeatRepository: Repository<SprRoundHeat>,

    @InjectRepository(F1ProjectionDreamTeam)
    private readonly f1ProjectionDreamTeamRepository: Repository<F1ProjectionDreamTeam>,
    @InjectRepository(MGProjectionDreamTeam)
    private readonly mgProjectionDreamTeamRepository: Repository<MGProjectionDreamTeam>,
    @InjectRepository(MXGPProjectionDreamTeam)
    private readonly mxgpProjectionDreamTeamRepository: Repository<MXGPProjectionDreamTeam>,

    @InjectRepository(MOTOCRSProjectionExactas)
    private readonly motocrsProjectionExactasRepository: Repository<MOTOCRSProjectionExactas>,

    @InjectDataSource() private dataSource,
  ) {}

  async fetchOdds(eventId: string, oddType: string, exactasType: ExactasType) {
    let repositoryName;
    const sportType: SportsTypes = eventId.split(":")[0] as SportsTypes;
    const id: string = eventId.split(":")[1];

    let dataObj: EventOddsResponse = {
      eventId,
      oddType,
      eventWinner: [],
      secondPlace: [],
      heatWinner: [],
      shows: [],
      podiums: [],
      headToHead: [],
      propBets: [],
      dreamTeam: [],
      eventExacta: [],
      heatExacta: [],
    };
    // TODO: pending fdrift propBets, shows, podiums public odds
    // TODO: pending motocross shows public odds
    switch (oddType) {
      case PublicOddTypes.EVENT_WINNER: {
        switch (sportType) {
          case SportsTypes.SURFING: {
            repositoryName = WslClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.FDRIFT: {
            repositoryName = FdriftClientProjectionEventOutcome;
            break;
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientProjectionEventOutcome")
          .leftJoinAndSelect("clientProjectionEventOutcome.participant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .where({
            eventId: id,
            position: 1,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.eventWinner = odds.map((odd) => ({
          id: odd.id,
          position: +odd.position,
          odds: +odd.odds,
          probability: +odd.probability,
          athlete: {
            id: odd.participant.athlete.id,
            firstName: odd.participant.athlete.firstName,
            middleName: odd.participant.athlete.middleName,
            lastName: odd.participant.athlete.lastName,
            stance: odd.participant.athlete.stance,
            nationality: odd.participant.athlete.nationality,
            seedNo: odd.participant.seedNo,
          },
        }));
        break;
      }

      case PublicOddTypes.EVENT_SECOND_PLACE: {
        switch (sportType) {
          case SportsTypes.SURFING: {
            repositoryName = WslClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientProjectionEventOutcome;
            break;
          }
          case SportsTypes.FDRIFT: {
            repositoryName = FdriftClientProjectionEventOutcome;
            break;
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientProjectionEventOutcome")
          .leftJoinAndSelect("clientProjectionEventOutcome.participant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .where({
            eventId: id,
            position: 2,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.secondPlace = odds.map((odd) => ({
          id: odd.id,
          position: +odd.position,
          odds: +odd.odds,
          probability: +odd.probability,
          athlete: {
            id: odd.participant.athlete.id,
            firstName: odd.participant.athlete.firstName,
            middleName: odd.participant.athlete.middleName,
            lastName: odd.participant.athlete.lastName,
            stance: odd.participant.athlete.stance,
            nationality: odd.participant.athlete.nationality,
            seedNo: odd.participant.seedNo,
          },
        }));
        break;
      }

      case PublicOddTypes.HEAT_WINNER: {
        switch (sportType) {
          case SportsTypes.SURFING: {
            repositoryName = WslClientProjectionEventHeatOutcome;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientProjectionEventHeatOutcome;
            break;
          }
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientProjectionEventHeatOutcome;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientProjectionEventHeatOutcome;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientProjectionEventHeatOutcome;
            break;
          }
          case SportsTypes.FDRIFT: {
            repositoryName = FdriftClientProjectionEventHeatOutcome;
            break;
          }
        }

        const eventOdds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientProjectionEventHeatOutcome")
          .leftJoinAndSelect("clientProjectionEventHeatOutcome.participant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .leftJoinAndSelect("clientProjectionEventHeatOutcome.heat", "roundHeats")
          .leftJoinAndSelect("roundHeats.round", "rounds")
          .leftJoinAndSelect("rounds.eventRounds", "eventRounds")
          .where({
            eventId: id,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        const roundObj: {
          [key: string]: EventHeatOddsResponse;
        } = {};

        eventOdds.forEach((eventOdd) => {
          if (!roundObj[eventOdd.heat.round.id]) {
            const eventRound = eventOdd.heat.round.eventRounds.find(
              (eventRoundItem) => eventRoundItem.roundId === eventOdd.heat.round.id,
            );
            roundObj[eventOdd.heat.round.id] = {
              id: eventOdd.id,
              roundId: eventOdd.heat.round.id,
              roundName: eventOdd.heat.round.name,
              roundNo: eventOdd.heat.round.roundNo,
              roundStatus: RoundStatus[eventRound.roundStatus],
              heats: [],
            };
          }

          // find heat where the id matches
          const heat = roundObj[eventOdd.heat.round.id].heats.find(
            (heatItem) => heatItem.heatId === eventOdd.heat.id,
          );

          let marketStatus: OddMarketStatus;

          if (eventOdd.heat.isHeatWinnerMarketVoided) marketStatus = OddMarketStatus.VOID;
          else if (eventOdd.heat.isHeatWinnerMarketOpen) marketStatus = OddMarketStatus.OPEN;
          else marketStatus = OddMarketStatus.CLOSE;

          if (!heat)
            roundObj[eventOdd.heat.round.id].heats.push({
              heatId: eventOdd.heat.id,
              heatName: `${eventOdd.heat.heatName} ${eventOdd.heat.heatNo}`,
              heatNo: +eventOdd.heat.heatNo,
              // isHeatWinnerMarketVoided: eventOdd.heat.isHeatWinnerMarketVoided,
              // isHeatWinnerMarketOpen: eventOdd.heat.isHeatWinnerMarketOpen,
              marketStatus,
              heatStatus: HeatStatus[eventOdd.heat.heatStatus],
              athletes: [
                {
                  id: eventOdd.participant.athlete.id,
                  firstName: eventOdd.participant.athlete.firstName,
                  middleName: eventOdd.participant.athlete.middleName,
                  lastName: eventOdd.participant.athlete.lastName,
                  gender: eventOdd.participant.athlete.gender,
                  nationality: eventOdd.participant.athlete.nationality,
                  stance: eventOdd.participant.athlete.stance,
                  odds: +Number(eventOdd.odds).toFixed(2),
                  probability: +Number(eventOdd.probability).toFixed(2),
                  seedNo: +eventOdd.participant.seedNo,
                },
              ],
            });
          else {
            heat.athletes.push({
              id: eventOdd.participant.athlete.id,
              firstName: eventOdd.participant.athlete.firstName,
              middleName: eventOdd.participant.athlete.middleName,
              lastName: eventOdd.participant.athlete.lastName,
              gender: eventOdd.participant.athlete.gender,
              nationality: eventOdd.participant.athlete.nationality,
              stance: eventOdd.participant.athlete.stance,
              odds: +Number(eventOdd.odds).toFixed(2),
              probability: +Number(eventOdd.probability).toFixed(2),
              seedNo: +eventOdd.participant.seedNo,
            });

            roundObj[eventOdd.heat.round.id].heats = [
              ...roundObj[eventOdd.heat.round.id].heats.filter(
                (heatRound) => heatRound.heatId !== heat.heatId,
              ),
              heat,
            ];
          }

          return eventOdd;
        });

        const parsedData = Object.values(roundObj).sort((a, b) => a.roundNo - b.roundNo);

        dataObj.heatWinner = parsedData;
        break;
      }

      case PublicOddTypes.HEAD_TO_HEAD: {
        switch (sportType) {
          case SportsTypes.SURFING: {
            repositoryName = WslClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.FDRIFT: {
            repositoryName = FdriftClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.F1: {
            repositoryName = F1ClientPlayerHeadToHeads;
            break;
          }
          case SportsTypes.MotoGP: {
            repositoryName = MGClientPlayerHeadToHeads;
            break;
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientPlayerHeadToHeads")
          .leftJoinAndSelect("clientPlayerHeadToHeads.eventParticipant1", "eventParticipants1")
          .leftJoinAndSelect("clientPlayerHeadToHeads.eventParticipant2", "eventParticipants2")
          .leftJoinAndSelect("eventParticipants1.athlete", "athletes1")
          .leftJoinAndSelect("eventParticipants2.athlete", "athletes2")
          .where({
            eventId: id,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.headToHead = odds.map((odd) => {
          let betStatus: BetStatus;

          if (odd.payout) betStatus = BetStatus.PAYOUT;
          else if (odd.voided) betStatus = BetStatus.VOID;
          else if (odd.draw) betStatus = BetStatus.DRAW;
          else betStatus = BetStatus.OPEN;

          return {
            id: odd.id,
            eventParticipant1: {
              id: odd.eventParticipant1.id,
              position: +odd.player1Position,
              odds: +odd.player1Odds,
              athlete: {
                id: odd.eventParticipant1.athlete.id,
                firstName: odd.eventParticipant1.athlete.firstName,
                middleName: odd.eventParticipant1.athlete.middleName,
                lastName: odd.eventParticipant1.athlete.lastName,
                stance: odd.eventParticipant1.athlete.stance,
                nationality: odd.eventParticipant1.athlete.nationality,
              },
            },
            eventParticipant2: {
              id: odd.eventParticipant2.id,
              position: +odd.player2Position,
              odds: +odd.player2Odds,
              athlete: {
                id: odd.eventParticipant2.athlete.id,
                firstName: odd.eventParticipant2.athlete.firstName,
                middleName: odd.eventParticipant2.athlete.middleName,
                lastName: odd.eventParticipant2.athlete.lastName,
                stance: odd.eventParticipant2.athlete.stance,
                nationality: odd.eventParticipant2.athlete.nationality,
              },
            },
            winnerParticipantId: odd.eventParticipantWinnerId,
            // payout: odd.payout || null,
            // voided: odd.voided,
            // draw: odd.draw,
            betStatus,
          };
        });
        break;
      }

      case PublicOddTypes.PROP_BETS: {
        switch (sportType) {
          case SportsTypes.SURFING: {
            repositoryName = WslClientPropBets;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientPropBets;
            break;
          }
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientPropBets;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientPropBets;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientPropBets;
            break;
          }
          default: {
            throw systemExceptions.propBetOddsDoesNotExist();
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientPropBets")
          .leftJoinAndSelect("clientPropBets.eventParticipant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .where({
            eventId: id,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.propBets = odds.map((odd) => {
          let betStatus: BetStatus;

          if (odd.payout) betStatus = BetStatus.PAYOUT;
          else if (odd.voided) betStatus = BetStatus.VOID;
          else betStatus = BetStatus.OPEN;

          return {
            id: odd.id,
            proposition: odd.proposition,
            odds: +odd.odds,
            probability: +odd.probability,
            betStatus,
            // payout: odd.payout,
            // voided: odd.voided,
            athlete: odd.eventParticipant?.athlete
              ? {
                  id: odd.eventParticipant?.athlete.id,
                  firstName: odd.eventParticipant?.athlete.firstName,
                  middleName: odd.eventParticipant?.athlete.middleName,
                  lastName: odd.eventParticipant?.athlete.lastName,
                  stance: odd.eventParticipant?.athlete.stance,
                  nationality: odd.eventParticipant?.athlete.nationality,
                }
              : null,
          };
        });
        break;
      }

      case PublicOddTypes.SHOWS: {
        switch (sportType) {
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientProjectionEventShows;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientProjectionEventShows;
            break;
          }
          case SportsTypes.SURFING: {
            repositoryName = WslClientProjectionEventShows;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientProjectionEventShows;
            break;
          }

          default: {
            throw systemExceptions.showOddsDoesNotExist();
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientProjectionEventShows")
          .leftJoinAndSelect("clientProjectionEventShows.participant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .where({
            eventId: id,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.shows = odds.map((odd) => ({
          id: odd.id,
          odds: +odd.odds,
          probability: +odd.probability,
          athlete: {
            id: odd.participant.athlete.id,
            firstName: odd.participant.athlete.firstName,
            middleName: odd.participant.athlete.middleName,
            lastName: odd.participant.athlete.lastName,
            stance: odd.participant.athlete.stance,
            nationality: odd.participant.athlete.nationality,
            seedNo: odd.participant.seedNo,
          },
        }));
        break;
      }

      case PublicOddTypes.PODIUMS: {
        switch (sportType) {
          case SportsTypes.RALLYCROSS: {
            repositoryName = NrxClientProjectionEventPodiums;
            break;
          }
          case SportsTypes.SUPERCROSS: {
            repositoryName = SprClientProjectionEventPodiums;
            break;
          }
          case SportsTypes.MOTOCROSS: {
            repositoryName = MotocrsClientProjectionEventPodiums;
            break;
          }
          case SportsTypes.SURFING: {
            repositoryName = WslClientProjectionEventPodiums;
            break;
          }
          case SportsTypes.SKATEBOARDING: {
            repositoryName = SlsClientProjectionEventPodiums;
            break;
          }
          default: {
            throw systemExceptions.podiumOddsDoesNotExist();
          }
        }
        const odds = await this.dataSource
          .getRepository(repositoryName)
          .createQueryBuilder("clientProjectionEventPodiums")
          .leftJoinAndSelect("clientProjectionEventPodiums.participant", "eventParticipants")
          .leftJoinAndSelect("eventParticipants.athlete", "athletes")
          .where({
            eventId: id,
            isActive: true,
            isArchived: false,
          })
          .getMany();

        dataObj.podiums = odds.map((odd) => ({
          id: odd.id,
          odds: +odd.odds,
          probability: +odd.probability,
          athlete: {
            id: odd.participant.athlete.id,
            firstName: odd.participant.athlete.firstName,
            middleName: odd.participant.athlete.middleName,
            lastName: odd.participant.athlete.lastName,
            stance: odd.participant.athlete.stance,
            nationality: odd.participant.athlete.nationality,
            seedNo: odd.participant.seedNo,
          },
        }));
        break;
      }

      case PublicOddTypes.DREAM_TEAM: {
        switch (sportType) {
          case SportsTypes.F1: {
            repositoryName = this.f1ProjectionDreamTeamRepository;
            break;
          }
          case SportsTypes.MotoGP: {
            repositoryName = this.mgProjectionDreamTeamRepository;
            break;
          }
          case SportsTypes.MXGP: {
            repositoryName = this.mxgpProjectionDreamTeamRepository;
            break;
          }
          default: {
            throw systemExceptions.dreamTeamDoesNotExist();
          }
        }

        const projectionDreamTeam = await repositoryName.find({
          where: {
            eventId: id,
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
              odds: true,
              participants: {},
            },
          },
          order: {
            voided: "ASC",
          },
        });

        dataObj.dreamTeam = projectionDreamTeam.map((row) => {
          let betStatus: BetStatus;

          if (row.payout) betStatus = BetStatus.PAYOUT;
          else if (row.voided) betStatus = BetStatus.VOID;
          else if (row.draw) betStatus = BetStatus.DRAW;
          else betStatus = BetStatus.OPEN;

          return {
            id: row.id,
            eventId: row.eventId,
            betStatus,
            teams: row.participants.map((participant) => ({
              id: participant.id,
              team: participant.team,
              odds: +Number(participant.odds).toFixed(2),
              participants: participant.participants,
            })),
          };
        });
        break;
      }

      case PublicOddTypes.EVENT_EXACTA: {
        switch (sportType) {
          case SportsTypes.MOTOCROSS: {
            repositoryName = this.motocrsProjectionExactasRepository;
            break;
          }
          default: {
            throw systemExceptions.eventExactaDoesNotExist();
          }
        }

        const projectionExactas = await repositoryName.find({
          where: {
            eventId: id,
            position: exactasType,
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

        dataObj.eventExacta = projectionExactas.map((row) => {
          return {
            id: row.id,
            eventId: row.eventId,
            roundHeatId: row.roundHeatId,
            position: row.position,
            voided: row.voided,
            draw: row.draw,
            holdingPercentage: +Number(row.holdingPercentage).toFixed(2),
            odds: +Number(row.odds).toFixed(2),
            probability: +Number(row.probability).toFixed(2),
            trueProbability: +Number(row.trueProbability).toFixed(2),
            hasModifiedProbability: row.hasModifiedProbability,
            participants: row.participants,
          };
        });
        break;
      }

      case PublicOddTypes.HEAT_EXACTA: {
        switch (sportType) {
          case SportsTypes.MOTOCROSS: {
            repositoryName = this.motocrsProjectionExactasRepository;
            break;
          }
          default: {
            throw systemExceptions.heatExactaDoesNotExist();
          }
        }

        const projectionExactas = await repositoryName.find({
          where: {
            eventId: id,
            roundHeatId: Not(IsNull()),
            position: exactasType,
            visible: true,
            heat: {
              eventId: id,
              round: {
                eventRounds: {
                  eventId: id,
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

        const roundObj: {
          [key: string]: ProjectionExactasHeatResponse;
        } = {};

        projectionExactas.forEach((eventOdd) => {
          if (!roundObj[eventOdd.heat.round.id]) {
            const eventRound = eventOdd.heat.round.eventRounds.find(
              (eventRoundItem) => eventRoundItem.roundId === eventOdd.heat.round.id,
            );
            roundObj[eventOdd.heat.round.id] = {
              id: eventOdd.id,
              roundId: eventOdd.heat.round.id,
              name: eventOdd.heat.round.name,
              roundNo: eventOdd.heat.round.roundNo,
              roundStatus: eventRound.roundStatus,
              heats: [],
              createdAt: eventOdd.createdAt,
              updatedAt: eventOdd.updatedAt,
            };
          }

          // find heat where the id matches
          const heat = roundObj[eventOdd.heat.round.id].heats.find(
            (heatItem) => heatItem.id === eventOdd.heat.id,
          );

          if (!heat)
            roundObj[eventOdd.heat.round.id].heats.push({
              id: eventOdd.heat.id,
              name: `${eventOdd.heat.heatName} ${eventOdd.heat.heatNo}`,
              heatNo: +eventOdd.heat.heatNo,
              // isHeatWinnerMarketVoided: eventOdd.heat.isHeatWinnerMarketVoided,
              // isHeatWinnerMarketOpen: eventOdd.heat.isHeatWinnerMarketOpen,
              // heatWinnerAthleteId: eventOdd.heat.winnerAthleteId,
              heatStatus: eventOdd.heat.heatStatus,
              athletes: [
                {
                  heatOddId: eventOdd.id,
                  voided: eventOdd.voided,
                  draw: eventOdd.draw,
                  holdingPercentage: +Number(eventOdd.holdingPercentage).toFixed(2),
                  odds: +Number(eventOdd.odds).toFixed(2),
                  probability: +Number(eventOdd.probability).toFixed(2),
                  trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
                  hasModifiedProbability: eventOdd.hasModifiedProbability,
                  participants: eventOdd.participants,
                },
              ],
            });
          else {
            heat.athletes.push({
              heatOddId: eventOdd.id,
              voided: eventOdd.voided,
              draw: eventOdd.draw,
              holdingPercentage: +Number(eventOdd.holdingPercentage).toFixed(2),
              odds: +Number(eventOdd.odds).toFixed(2),
              probability: +Number(eventOdd.probability).toFixed(2),
              trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
              hasModifiedProbability: eventOdd.hasModifiedProbability,
              participants: eventOdd.participants,
            });

            roundObj[eventOdd.heat.round.id].heats = [
              ...roundObj[eventOdd.heat.round.id].heats.filter(
                (heatRound) => heatRound.id !== heat.id,
              ),
              heat,
            ];
          }

          return eventOdd;
        });

        const parsedData = Object.values(roundObj).sort((a, b) => a.roundNo - b.roundNo);

        dataObj.heatExacta = parsedData;
        break;
      }
    }

    return dataObj;
  }

  async fetchEvent(eventId: string): Promise<EventResponse> {
    let eventObj: EventResponse = null;

    const sportType: SportsTypes = eventId.split(":")[0] as SportsTypes;
    const id: string = eventId.split(":")[1];

    switch (sportType) {
      case SportsTypes.SURFING: {
        const event = await this.wslEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
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
            tourYear: {
              year: true,
              tourId: true,
              tour: {
                id: true,
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              roundStatus: RoundStatus[round.roundStatus],
              startDate: round.startDate,
              endDate: round.endDate,
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                heatStatus: HeatStatus[heat.heatStatus],
                startDate: heat.startDate,
                endDate: heat.endDate,
              })),
            })),
          };
        }

        break;
      }
      case SportsTypes.SKATEBOARDING: {
        const event = await this.slsEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
          relations: ["leagueYear.league", "rounds.round.heats"],
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            eventStatus: true,
            eventLocation: true,
            eventLocationGroup: true,
            leagueYear: {
              year: true,
              league: {
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.leagueYear.league.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: null,
            eventStatus: EventStatus[event.eventStatus],
            year: event.leagueYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              roundStatus: RoundStatus[round.roundStatus],
              startDate: round.startDate,
              endDate: round.endDate,
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                heatStatus: HeatStatus[heat.heatStatus],
                startDate: heat.startDate,
                endDate: heat.endDate,
              })),
            })),
          };
        }

        break;
      }
      case SportsTypes.RALLYCROSS: {
        const event = await this.nrxEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
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
            tourYear: {
              year: true,
              tourId: true,
              tour: {
                id: true,
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              startDate: round.startDate,
              endDate: round.endDate,
              roundStatus: RoundStatus[round.roundStatus],
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                startDate: heat.startDate,
                endDate: heat.endDate,
                heatStatus: HeatStatus[heat.heatStatus],
              })),
            })),
          };
        }

        break;
      }
      case SportsTypes.SUPERCROSS: {
        const event = await this.sprEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
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
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              startDate: round.startDate,
              endDate: round.endDate,
              roundStatus: RoundStatus[round.roundStatus],
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                startDate: heat.startDate,
                endDate: heat.endDate,
                heatStatus: HeatStatus[heat.heatStatus],
              })),
            })),
          };
        }

        break;
      }

      case SportsTypes.FDRIFT: {
        const event = await this.fdriftEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
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
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              startDate: round.startDate,
              endDate: round.endDate,
              roundStatus: RoundStatus[round.roundStatus],
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                startDate: heat.startDate,
                endDate: heat.endDate,
                heatStatus: HeatStatus[heat.heatStatus],
              })),
            })),
          };
        }

        break;
      }

      case SportsTypes.MOTOCROSS: {
        const event = await this.motocrsEventRepository.findOne({
          where: {
            id,
            rounds: {
              eventId: id,
              round: {
                heats: {
                  eventId: id,
                },
              },
            },
          },
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
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
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
          order: {
            rounds: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: event.rounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              startDate: round.startDate,
              endDate: round.endDate,
              roundStatus: RoundStatus[round.roundStatus],
              scores: [],
              heats: round.round.heats.map((heat) => ({
                id: heat.id,
                heatName: heat.heatName,
                heatNo: heat.heatNo,
                startDate: heat.startDate,
                endDate: heat.endDate,
                heatStatus: HeatStatus[heat.heatStatus],
              })),
            })),
          };
        }

        break;
      }

      case SportsTypes.MASL: {
        const event = await this.maslEventRepository.findOne({
          where: {
            id,
            eventRounds: {
              eventId: id,
              round: {
                scores: {
                  eventId: id,
                },
              },
            },
            teams: {
              eventId: id,
            },
          },
          relations: ["leagueYear.league", "eventRounds.round.scores", "teams.team"],
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            eventStatus: true,
            eventLocation: true,
            eventLocationGroup: true,
            leagueYear: {
              year: true,
              leagueId: true,
              league: {
                id: true,
                name: true,
              },
            },
            eventRounds: {
              id: true,
              startDate: true,
              endDate: true,
              roundStatus: true,
              round: {
                id: true,
                name: true,
                roundNo: true,
                scores: {
                  id: true,
                  teamId: true,
                  goals: true,
                },
              },
            },
            teams: {
              id: true,
              isHomeTeam: true,
              team: {
                id: true,
                name: true,
                shortName: true,
                logo: true,
              },
            },
          },
          order: {
            eventRounds: {
              round: {
                roundNo: "ASC",
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.leagueYear.league.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: null,
            eventStatus: EventStatus[event.eventStatus],
            year: event.leagueYear.year,
            teams: event.teams.map((team) => ({
              id: team.team.id,
              name: team.team.name,
              shortName: team.team.shortName,
              logo: team.team.logo,
              isHomeTeam: team.isHomeTeam,
            })),
            rounds: event.eventRounds.map((round) => ({
              id: round.id,
              roundName: round.round.name,
              roundNo: round.round.roundNo,
              startDate: round.startDate,
              endDate: round.endDate,
              roundStatus: RoundStatus[round.roundStatus],
              heats: [],
              scores: round.round.scores.map((score) => ({
                id: score.id,
                teamId: score.teamId,
                goals: score.goals,
              })),
            })),
          };
        }

        break;
      }

      case SportsTypes.F1: {
        const event = await this.f1EventRepository.findOne({
          where: {
            id,
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
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: [],
          };
        }

        break;
      }

      case SportsTypes.MotoGP: {
        const event = await this.mgEventRepository.findOne({
          where: {
            id,
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
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
          },
        });

        if (event) {
          eventObj = {
            id: eventId,
            name: event.name,
            tourName: event.tourYear.tour.name,
            startDate: event.startDate,
            endDate: event.endDate,
            eventLocation: event.eventLocation,
            eventLocationGroup: event.eventLocationGroup,
            eventNumber: event.eventNumber,
            eventStatus: EventStatus[event.eventStatus],
            year: event.tourYear.year,
            teams: [],
            rounds: [],
          };
        }

        break;
      }
    }

    return eventObj;
  }

  public async fetchEvents() {
    const events = await this.wslEventRepository.query(`
      select 
        concat('${SportsTypes.RALLYCROSS}:', ${SportsDbSchema.NRX}."events"."id") as id,
        ${SportsDbSchema.NRX}."events"."name" as name,
        ${SportsDbSchema.NRX}."tours"."name" as "tourName",
        ${SportsDbSchema.NRX}."tourYears"."year" as "year",
        ${SportsDbSchema.NRX}."events"."startDate" as "startDate",
        ${SportsDbSchema.NRX}."events"."endDate" as "endDate",
        ${SportsDbSchema.NRX}."events"."eventLocation" as "eventLocation",
        ${SportsDbSchema.NRX}."events"."eventLocationGroup" as "eventLocationGroup",
        ${SportsDbSchema.NRX}."events"."eventStatus" as "eventStatus",
        ${SportsDbSchema.NRX}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.NRX}."events"
      LEFT JOIN ${SportsDbSchema.NRX}."tourYears" 
        ON ${SportsDbSchema.NRX}."events"."tourYearId" = ${SportsDbSchema.NRX}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.NRX}."tours"
        ON ${SportsDbSchema.NRX}."tourYears"."tourId" = ${SportsDbSchema.NRX}."tours"."id"
      WHERE ${SportsDbSchema.NRX}."events"."isActive" = true AND  ${SportsDbSchema.NRX}."events"."isArchived" = false
      
      UNION ALL 

      select 
       concat('${SportsTypes.SKATEBOARDING}:', ${SportsDbSchema.SLS}."events"."id") as id,
       ${SportsDbSchema.SLS}."events"."name" as name,  
       ${SportsDbSchema.SLS}."leagues"."name" as "tourName",
       ${SportsDbSchema.SLS}."leagueYears"."year" as "year", 
       ${SportsDbSchema.SLS}."events"."startDate" as "startDate", 
       ${SportsDbSchema.SLS}."events"."endDate" as "endDate", 
       ${SportsDbSchema.SLS}."events"."eventLocation" as "eventLocation",
       ${SportsDbSchema.SLS}."events"."eventLocationGroup" as "eventLocationGroup", 
       ${SportsDbSchema.SLS}."events"."eventStatus" as "eventStatus",
       NULL as "eventNumber"  
      from
        ${SportsDbSchema.SLS}."events"
      LEFT JOIN ${SportsDbSchema.SLS}."leagueYears" 
        ON ${SportsDbSchema.SLS}."events"."leagueYearId" = ${SportsDbSchema.SLS}."leagueYears"."id" 
      LEFT JOIN ${SportsDbSchema.SLS}."leagues" 
        ON ${SportsDbSchema.SLS}."leagueYears"."leagueId" = ${SportsDbSchema.SLS}."leagues"."id"
      WHERE ${SportsDbSchema.SLS}."events"."isActive" = true AND  ${SportsDbSchema.SLS}."events"."isArchived" = false
      
      UNION ALL

      select 
        concat('${SportsTypes.SURFING}:', ${SportsDbSchema.WSL}."events"."id") as id, 
        ${SportsDbSchema.WSL}."events"."name" as name, 
        ${SportsDbSchema.WSL}."tours"."name" as "tourName", 
        ${SportsDbSchema.WSL}."tourYears"."year" as "year", 
        ${SportsDbSchema.WSL}."events"."startDate" as "startDate", 
        ${SportsDbSchema.WSL}."events"."endDate" as "endDate", 
        ${SportsDbSchema.WSL}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.WSL}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.WSL}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.WSL}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.WSL}."events"
      LEFT JOIN ${SportsDbSchema.WSL}."tourYears" 
        ON ${SportsDbSchema.WSL}."events"."tourYearId" = ${SportsDbSchema.WSL}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.WSL}."tours" 
        ON ${SportsDbSchema.WSL}."tourYears"."tourId" = ${SportsDbSchema.WSL}."tours"."id"
      WHERE ${SportsDbSchema.WSL}."events"."isActive" = true AND  ${SportsDbSchema.WSL}."events"."isArchived" = false

      UNION ALL

      select 
        concat('${SportsTypes.SUPERCROSS}:', ${SportsDbSchema.SPR}."events"."id") as id, 
        ${SportsDbSchema.SPR}."events"."name" as name, 
        ${SportsDbSchema.SPR}."tours"."name" as "tourName", 
        ${SportsDbSchema.SPR}."tourYears"."year" as "year", 
        ${SportsDbSchema.SPR}."events"."startDate" as "startDate",
        ${SportsDbSchema.SPR}."events"."endDate" as "endDate", 
        ${SportsDbSchema.SPR}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.SPR}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.SPR}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.SPR}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.SPR}."events"
      LEFT JOIN ${SportsDbSchema.SPR}."tourYears" 
        ON ${SportsDbSchema.SPR}."events"."tourYearId" = ${SportsDbSchema.SPR}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.SPR}."tours" 
        ON ${SportsDbSchema.SPR}."tourYears"."tourId" = ${SportsDbSchema.SPR}."tours"."id"
      WHERE ${SportsDbSchema.SPR}."events"."isActive" = true AND  ${SportsDbSchema.SPR}."events"."isArchived" = false
      
      UNION ALL
      
      select 
        concat('${SportsTypes.MASL}:', ${SportsDbSchema.MASL}."events"."id") as id,
        ${SportsDbSchema.MASL}."events"."name" as name,
        ${SportsDbSchema.MASL}."leagues"."name" as "tourName",
        ${SportsDbSchema.MASL}."leagueYears"."year" as "year",
        ${SportsDbSchema.MASL}."events"."startDate" as "startDate",
        ${SportsDbSchema.MASL}."events"."endDate" as "endDate",
        ${SportsDbSchema.MASL}."events"."eventLocation" as "eventLocation",
        ${SportsDbSchema.MASL}."events"."eventLocationGroup" as "eventLocationGroup",
        ${SportsDbSchema.MASL}."events"."eventStatus" as "eventStatus",
        NULL as "eventNumber"  
      from
        ${SportsDbSchema.MASL}."events"
      LEFT JOIN ${SportsDbSchema.MASL}."leagueYears" 
        ON ${SportsDbSchema.MASL}."events"."leagueYearId" = ${SportsDbSchema.MASL}."leagueYears"."id" 
      LEFT JOIN ${SportsDbSchema.MASL}."leagues"
        ON ${SportsDbSchema.MASL}."leagueYears"."leagueId" = ${SportsDbSchema.MASL}."leagues"."id"
      WHERE ${SportsDbSchema.MASL}."events"."isActive" = true AND  ${SportsDbSchema.MASL}."events"."isArchived" = false

      UNION ALL

      select 
        concat('${SportsTypes.MOTOCROSS}:', ${SportsDbSchema.MOTOCRS}."events"."id") as id, 
        ${SportsDbSchema.MOTOCRS}."events"."name" as name, 
        ${SportsDbSchema.MOTOCRS}."tours"."name" as "tourName", 
        ${SportsDbSchema.MOTOCRS}."tourYears"."year" as "year", 
        ${SportsDbSchema.MOTOCRS}."events"."startDate" as "startDate",
        ${SportsDbSchema.MOTOCRS}."events"."endDate" as "endDate", 
        ${SportsDbSchema.MOTOCRS}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.MOTOCRS}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.MOTOCRS}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.MOTOCRS}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.MOTOCRS}."events"
      LEFT JOIN ${SportsDbSchema.MOTOCRS}."tourYears" 
        ON ${SportsDbSchema.MOTOCRS}."events"."tourYearId" = ${SportsDbSchema.MOTOCRS}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.MOTOCRS}."tours" 
        ON ${SportsDbSchema.MOTOCRS}."tourYears"."tourId" = ${SportsDbSchema.MOTOCRS}."tours"."id"
      WHERE ${SportsDbSchema.MOTOCRS}."events"."isActive" = true AND  ${SportsDbSchema.MOTOCRS}."events"."isArchived" = false
          
      UNION ALL

      select 
        concat('${SportsTypes.FDRIFT}:', ${SportsDbSchema.FDRIFT}."events"."id") as id, 
        ${SportsDbSchema.FDRIFT}."events"."name" as name, 
        ${SportsDbSchema.FDRIFT}."tours"."name" as "tourName", 
        ${SportsDbSchema.FDRIFT}."tourYears"."year" as "year", 
        ${SportsDbSchema.FDRIFT}."events"."startDate" as "startDate",
        ${SportsDbSchema.FDRIFT}."events"."endDate" as "endDate", 
        ${SportsDbSchema.FDRIFT}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.FDRIFT}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.FDRIFT}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.FDRIFT}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.FDRIFT}."events"
      LEFT JOIN ${SportsDbSchema.FDRIFT}."tourYears" 
        ON ${SportsDbSchema.FDRIFT}."events"."tourYearId" = ${SportsDbSchema.FDRIFT}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.FDRIFT}."tours" 
        ON ${SportsDbSchema.FDRIFT}."tourYears"."tourId" = ${SportsDbSchema.FDRIFT}."tours"."id"
      WHERE ${SportsDbSchema.FDRIFT}."events"."isActive" = true AND  ${SportsDbSchema.FDRIFT}."events"."isArchived" = false

      UNION ALL

      select 
        concat('${SportsTypes.F1}:', ${SportsDbSchema.F1}."events"."id") as id, 
        ${SportsDbSchema.F1}."events"."name" as name, 
        ${SportsDbSchema.F1}."tours"."name" as "tourName", 
        ${SportsDbSchema.F1}."tourYears"."year" as "year", 
        ${SportsDbSchema.F1}."events"."startDate" as "startDate",
        ${SportsDbSchema.F1}."events"."endDate" as "endDate", 
        ${SportsDbSchema.F1}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.F1}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.F1}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.F1}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.F1}."events"
      LEFT JOIN ${SportsDbSchema.F1}."tourYears" 
        ON ${SportsDbSchema.F1}."events"."tourYearId" = ${SportsDbSchema.F1}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.F1}."tours" 
        ON ${SportsDbSchema.F1}."tourYears"."tourId" = ${SportsDbSchema.F1}."tours"."id"
      WHERE ${SportsDbSchema.F1}."events"."isActive" = true AND  ${SportsDbSchema.F1}."events"."isArchived" = false
  
      UNION ALL

      select 
        concat('${SportsTypes.MotoGP}:', ${SportsDbSchema.MotoGP}."events"."id") as id, 
        ${SportsDbSchema.MotoGP}."events"."name" as name, 
        ${SportsDbSchema.MotoGP}."tours"."name" as "tourName", 
        ${SportsDbSchema.MotoGP}."tourYears"."year" as "year", 
        ${SportsDbSchema.MotoGP}."events"."startDate" as "startDate",
        ${SportsDbSchema.MotoGP}."events"."endDate" as "endDate", 
        ${SportsDbSchema.MotoGP}."events"."eventLocation" as "eventLocation", 
        ${SportsDbSchema.MotoGP}."events"."eventLocationGroup" as "eventLocationGroup", 
        ${SportsDbSchema.MotoGP}."events"."eventStatus" as "eventStatus", 
        ${SportsDbSchema.MotoGP}."events"."eventNumber" as "eventNumber" 
      from
        ${SportsDbSchema.MotoGP}."events"
      LEFT JOIN ${SportsDbSchema.MotoGP}."tourYears" 
        ON ${SportsDbSchema.MotoGP}."events"."tourYearId" = ${SportsDbSchema.MotoGP}."tourYears"."id" 
      LEFT JOIN ${SportsDbSchema.MotoGP}."tours" 
        ON ${SportsDbSchema.MotoGP}."tourYears"."tourId" = ${SportsDbSchema.MotoGP}."tours"."id"
      WHERE ${SportsDbSchema.MotoGP}."events"."isActive" = true AND  ${SportsDbSchema.MotoGP}."events"."isArchived" = false
    `);

    return events;
  }

  async fetchHeatScore(eventId: string, heatId: string): Promise<RoundScoreResponse[]> {
    let parsedScores: RoundScoreResponse[] = [];

    const sportType: SportsTypes = eventId.split(":")[0] as SportsTypes;
    const id: string = eventId.split(":")[1];

    switch (sportType) {
      case SportsTypes.SURFING: {
        let [heat, wslScores] = await Promise.all([
          this.wslHeatRepository.findOne({
            where: {
              id: heatId,
              eventId: id,
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

          this.wslScoreRepository.find({
            where: {
              roundHeatId: heatId,
              isActive: true,
              isArchived: false,
            },
            relations: ["athlete"],
            select: {
              id: true,
              roundHeatId: true,
              roundSeed: true,
              heatScore: true,
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
        ]);

        if (!heat) throw heatExceptions.heatNotFound();

        parsedScores = wslScores.map((wslScore) => ({
          id: wslScore?.id,
          eventId,
          heatId: wslScore.roundHeatId,
          athleteRoundSeed: +wslScore?.roundSeed,
          athleteHeatScore: +wslScore?.heatScore,
          athleteLapTime: null,
          athleteTotalLaps: null,
          athleteRoundRank: +wslScore?.heatPosition,
          athleteLapStatus: null,
          athletePenaltyTime: null,
          athleteJokerLapTime: null,
          athleteJokerLap: null,
          roundScore: null,
          lineScore1: null,
          lineScore2: null,
          trick1Score: null,
          trick2Score: null,
          trick3Score: null,
          trick4Score: null,
          trick5Score: null,
          trick6Score: null,
          athlete: {
            id: wslScore?.athlete?.id,
            firstName: wslScore?.athlete?.firstName,
            middleName: wslScore?.athlete?.middleName,
            lastName: wslScore?.athlete?.lastName,
            nationality: wslScore?.athlete?.nationality,
            stance: wslScore?.athlete?.stance,
          },
        }));

        break;
      }

      case SportsTypes.SKATEBOARDING: {
        let [heat, slsScores] = await Promise.all([
          this.slsHeatRepository.findOne({
            where: {
              id: heatId,
              eventId: id,
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

          this.slsScoreRepository.find({
            where: {
              roundHeatId: heatId,
              isActive: true,
              isArchived: false,
            },
            relations: ["athlete"],
            select: {
              id: true,
              roundHeatId: true,
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
        ]);

        if (!heat) throw heatExceptions.heatNotFound();

        parsedScores = slsScores.map((slsScore) => ({
          id: slsScore?.id,
          eventId,
          heatId: slsScore.roundHeatId,
          athleteRoundSeed: +slsScore?.roundSeed,
          athleteLapTime: null,
          athleteLapStatus: null,
          athletePenaltyTime: null,
          athleteJokerLapTime: null,
          athleteJokerLap: null,
          athleteTotalLaps: null,
          athleteRoundRank: +slsScore?.heatPosition,
          athleteHeatScore: null,
          roundScore: +slsScore?.roundScore,
          lineScore1: +slsScore?.lineScore1,
          lineScore2: +slsScore?.lineScore2,
          trick1Score: +slsScore?.trick1Score,
          trick2Score: +slsScore?.trick2Score,
          trick3Score: +slsScore?.trick3Score,
          trick4Score: +slsScore?.trick4Score,
          trick5Score: +slsScore?.trick5Score,
          trick6Score: +slsScore?.trick6Score,
          athlete: {
            id: slsScore?.athlete?.id,
            firstName: slsScore?.athlete?.firstName,
            middleName: slsScore?.athlete?.middleName,
            lastName: slsScore?.athlete?.lastName,
            nationality: slsScore?.athlete?.nationality,
            stance: slsScore?.athlete?.stance,
          },
        }));

        break;
      }

      case SportsTypes.RALLYCROSS: {
        let [heat, nrxScores] = await Promise.all([
          this.nrxHeatRepository.findOne({
            where: {
              id: heatId,
              eventId: id,
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

          this.nrxScoreRepository.find({
            where: {
              roundHeatId: heatId,
              isActive: true,
              isArchived: false,
            },
            relations: ["athlete"],
            select: {
              id: true,
              roundHeatId: true,
              roundSeed: true,
              lapTime: true,
              lapNumber: true,
              heatPosition: true,
              status: true,
              penaltyTime: true,
              isJoker: true,
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
        ]);

        if (!heat) throw heatExceptions.heatNotFound();

        const nrxAthleteScores: {
          [athleteId: string]: NrxScore[];
        } = groupBy(nrxScores, "athlete.id");

        Object.values(nrxAthleteScores).forEach((values) => {
          const nrxScore = values[0];

          let jokerLap: number = null;
          let totalLapTime: number = 0;
          let jokerLapTime: number = 0;
          let totalPenaltyTime: number = 0;
          let totalLaps: number = Math.max(...values.map((item) => item.lapNumber));

          values.forEach((item) => {
            if (item.isJoker) {
              jokerLap = item.lapNumber;
              jokerLapTime = +item.lapTime;
            }

            totalLapTime += +item.lapTime;
            totalPenaltyTime += +item.penaltyTime;
          });

          parsedScores.push({
            id: nrxScore?.id,
            eventId,
            heatId: nrxScore?.roundHeatId,
            athleteRoundSeed: +nrxScore?.roundSeed,
            athleteLapTime: +totalLapTime.toFixed(2),
            athleteLapStatus: nrxScore.status,
            athletePenaltyTime: +totalPenaltyTime.toFixed(2),
            athleteJokerLapTime: +jokerLapTime.toFixed(2),
            athleteJokerLap: jokerLap,
            athleteTotalLaps: totalLaps,
            athleteHeatScore: null,
            roundScore: null,
            lineScore1: null,
            lineScore2: null,
            athleteRoundRank: +nrxScore?.heatPosition,
            trick1Score: null,
            trick2Score: null,
            trick3Score: null,
            trick4Score: null,
            trick5Score: null,
            trick6Score: null,
            athlete: {
              id: nrxScore?.athlete?.id,
              firstName: nrxScore?.athlete?.firstName,
              middleName: nrxScore?.athlete?.middleName,
              lastName: nrxScore?.athlete?.lastName,
              nationality: nrxScore?.athlete?.nationality,
              stance: nrxScore?.athlete?.stance,
            },
          });
        });

        break;
      }

      case SportsTypes.SUPERCROSS: {
        let [heat, sprScores] = await Promise.all([
          this.sprHeatRepository.findOne({
            where: {
              id: heatId,
              eventId: id,
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
          this.sprScoreRepository.find({
            where: {
              roundHeatId: heatId,
              isActive: true,
              isArchived: false,
            },
            relations: ["athlete"],
            select: {
              id: true,
              roundHeatId: true,
              roundSeed: true,
              lapTime: true,
              lapNumber: true,
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
        ]);

        if (!heat) throw heatExceptions.heatNotFound();

        parsedScores = sprScores.map((sprScore) => ({
          id: sprScore?.id,
          eventId,
          heatId: sprScore?.roundHeatId,
          athleteRoundSeed: +sprScore?.roundSeed,
          athleteLapTime: +sprScore?.lapTime,
          athleteJokerLapTime: null,
          athleteJokerLap: null,
          athleteTotalLaps: +sprScore?.lapNumber,
          athleteLapStatus: null,
          athletePenaltyTime: null,
          athleteHeatScore: null,
          roundScore: null,
          lineScore1: null,
          lineScore2: null,
          athleteRoundRank: +sprScore?.heatPosition,
          trick1Score: null,
          trick2Score: null,
          trick3Score: null,
          trick4Score: null,
          trick5Score: null,
          trick6Score: null,
          athlete: {
            id: sprScore?.athlete?.id,
            firstName: sprScore?.athlete?.firstName,
            middleName: sprScore?.athlete?.middleName,
            lastName: sprScore?.athlete?.lastName,
            nationality: sprScore?.athlete?.nationality,
            stance: sprScore?.athlete?.stance,
          },
        }));

        break;
      }
    }

    return parsedScores;
  }
}
