/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import WSLEvents from "../../../entities/wsl/events.entity";
import SLSEvents from "../../../entities/sls/events.entity";
import MASLEvents from "../../../entities/masl/events.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import SPREvents from "../../../entities/spr/events.entity";
import MOTOCRSEvents from "../../../entities/motocrs/events.entity";
import FDRIFTEvents from "../../../entities/fdrift/events.entity";
import F1Events from "../../../entities/f1/events.entity";
import MGEvents from "../../../entities/mg/events.entity";
import MXGPEvents from "../../../entities/mxgp/events.entity";

import WSLFutures from "../../../entities/wsl/futures.entity";
import SLSFutures from "../../../entities/sls/futures.entity";
import MASLFutures from "../../../entities/masl/futures.entity";
import NRXFutures from "../../../entities/nrx/futures.entity";
import SPRFutures from "../../../entities/spr/futures.entity";
import MOTOCRSFutures from "../../../entities/motocrs/futures.entity";
import FDRIFTFutures from "../../../entities/fdrift/futures.entity";
import F1Futures from "../../../entities/f1/futures.entity";
import MGFutures from "../../../entities/mg/futures.entity";
import MXGPFutures from "../../../entities/mxgp/futures.entity";

import TwilioService from "../../../services/twilio.service";

import ClientMarketNotifications from "../../../entities/clientMarketNotifications.entity";
import OddMarkets from "../../../entities/oddMarkets.entity";

import OpenbetAPIService from "./openbet.service";

import {
  SportsTypes,
  OddMarkets as Markets,
  FrontendOddPageParams,
} from "../../../constants/system";

@Injectable()
export default class NotificationsService {
  private isStaging: boolean;
  private isRelease: boolean;
  private isDevelop: boolean;
  private clientHostUrl: string;

  constructor(
    @InjectRepository(WSLEvents) private readonly wslEventsRepository: Repository<WSLEvents>,
    @InjectRepository(SLSEvents) private readonly slsEventsRepository: Repository<SLSEvents>,
    @InjectRepository(MASLEvents) private readonly maslEventsRepository: Repository<MASLEvents>,
    @InjectRepository(NRXEvents) private readonly nrxEventsRepository: Repository<NRXEvents>,
    @InjectRepository(SPREvents) private readonly sprEventsRepository: Repository<SPREvents>,
    @InjectRepository(F1Events) private readonly f1EventsRepository: Repository<F1Events>,
    @InjectRepository(MGEvents) private readonly mgEventsRepository: Repository<MGEvents>,
    @InjectRepository(MXGPEvents) private readonly mxgpEventsRepository: Repository<MXGPEvents>,
    @InjectRepository(MOTOCRSEvents)
    private readonly motocrsEventsRepository: Repository<MOTOCRSEvents>,
    @InjectRepository(FDRIFTEvents)
    private readonly fdriftEventsRepository: Repository<FDRIFTEvents>,

    @InjectRepository(WSLFutures) private readonly wslFuturesRepository: Repository<WSLFutures>,
    @InjectRepository(SLSFutures) private readonly slsFuturesRepository: Repository<SLSFutures>,
    @InjectRepository(MASLFutures) private readonly maslFuturesRepository: Repository<MASLFutures>,
    @InjectRepository(NRXFutures) private readonly nrxFuturesRepository: Repository<NRXFutures>,
    @InjectRepository(SPRFutures) private readonly sprFuturesRepository: Repository<SPRFutures>,
    @InjectRepository(MOTOCRSFutures)
    private readonly motocrsFuturesRepository: Repository<MOTOCRSFutures>,
    @InjectRepository(FDRIFTFutures)
    private readonly fdriftFuturesRepository: Repository<FDRIFTFutures>,
    @InjectRepository(F1Futures) private readonly f1FuturesRepository: Repository<F1Futures>,
    @InjectRepository(MGFutures) private readonly mgFuturesRepository: Repository<MGFutures>,
    @InjectRepository(MXGPFutures) private readonly mxgpFuturesRepository: Repository<MXGPFutures>,

    @InjectRepository(ClientMarketNotifications)
    private readonly clientMarketNotificationsRepository: Repository<ClientMarketNotifications>,
    @InjectRepository(OddMarkets) private readonly oddMarketsRepository: Repository<OddMarkets>,

    private readonly twilioService: TwilioService,
    private readonly openbetAPIService: OpenbetAPIService,

    public configService: ConfigService,
  ) {
    this.isStaging = this.configService.get<boolean>("isStaging");
    this.isRelease = this.configService.get<boolean>("isRelease");
    this.isDevelop = this.configService.get<boolean>("isDevelop");
    this.clientHostUrl = this.configService.get<string>("client.host");
  }

  private isAllowed(): boolean {
    return this.isRelease || this.isStaging || this.isDevelop;
  }

  async notifyOddsPublished(
    sportType: SportsTypes,
    market: Markets,
    eventId?: string,
    futureId?: string,
    roundHeatId?: string,
  ): Promise<boolean> {
    try {
      console.log(
        "🚀 ~ file: notifications.service.ts:308 ~ NotificationsService ~ notifyOddsPublished:",
        this.isAllowed(),
        eventId,
        futureId,
        sportType,
        market,
      );

      if (!this.isAllowed()) return false;

      const marketRow = await this.oddMarketsRepository.findOne({
        where: {
          key: market,
          isActive: true,
          isArchived: false,
        },
        select: {
          id: true,
        },
      });

      // find all related client where either sms or email or slack is true
      const rows = await this.clientMarketNotificationsRepository.find({
        where: [
          {
            oddMarketId: marketRow.id,
            sms: true,
          },
          {
            oddMarketId: marketRow.id,
            email: true,
          },
          {
            oddMarketId: marketRow.id,
            slack: true,
          },
        ],
        select: {
          id: true,
          sms: true,
          email: true,
          slack: true,
          client: {
            id: true,
            phone: true,
            email: true,
            isPhoneVerified: true,
            isEmailVerified: true,
            country: true,
          },
        },
        relations: ["client"],
      });

      let tourName: string;
      let tourYear: number;
      let eventName: string;

      switch (sportType) {
        case SportsTypes.SURFING:
          if (eventId) {
            const wslEvent = await this.wslEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = wslEvent.tourYear.tour.name;
            tourYear = wslEvent.tourYear.year;
            eventName = wslEvent.name;
          } else if (futureId) {
            const wslFuture = await this.wslFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = wslFuture.tourYear.tour.name;
            tourYear = wslFuture.tourYear.year;
          }

          await this.openbetAPIService.processEvent(
            eventId,
            market,
            sportType,
            futureId,
            roundHeatId,
          );
          break;

        case SportsTypes.SKATEBOARDING:
          if (eventId) {
            const slsEvent = await this.slsEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                leagueYear: {
                  id: true,
                  year: true,
                  league: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["leagueYear.league"],
            });
            tourName = slsEvent.leagueYear.league.name;
            tourYear = slsEvent.leagueYear.year;
            eventName = slsEvent.name;
          } else if (futureId) {
            const slsFuture = await this.slsFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  league: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.league"],
            });
            tourName = slsFuture.tourYear.league.name;
            tourYear = slsFuture.tourYear.year;
          }
          break;

        case SportsTypes.MASL:
          if (eventId) {
            const maslEvent = await this.maslEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                leagueYear: {
                  id: true,
                  year: true,
                  league: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: {
                leagueYear: {
                  league: true,
                },
              },
            });
            tourName = maslEvent.leagueYear.league.name;
            tourYear = maslEvent.leagueYear.year;
            eventName = maslEvent.name;
          } else if (futureId) {
            const maslFuture = await this.maslFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  league: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: {
                tourYear: {
                  league: true,
                },
              },
            });
            tourName = maslFuture.tourYear.league.name;
            tourYear = maslFuture.tourYear.year;
          }
          break;

        case SportsTypes.RALLYCROSS:
          if (eventId) {
            const nrxEvent = await this.nrxEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = nrxEvent.tourYear.tour.name;
            tourYear = nrxEvent.tourYear.year;
            eventName = nrxEvent.name;
          } else if (futureId) {
            const nrxFuture = await this.nrxFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = nrxFuture.tourYear.tour.name;
            tourYear = nrxFuture.tourYear.year;
          }

          break;

        case SportsTypes.SUPERCROSS:
          if (eventId) {
            const sprEvent = await this.sprEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = sprEvent.tourYear.tour.name;
            tourYear = sprEvent.tourYear.year;
            eventName = sprEvent.name;
          } else if (futureId) {
            const sprFuture = await this.sprFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = sprFuture.tourYear.tour.name;
            tourYear = sprFuture.tourYear.year;
          }
          break;

        case SportsTypes.MOTOCROSS: {
          if (eventId) {
            const motocrsEvent = await this.motocrsEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = motocrsEvent.tourYear.tour.name;
            tourYear = motocrsEvent.tourYear.year;
            eventName = motocrsEvent.name;
          } else if (futureId) {
            const motocrsFuture = await this.motocrsFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = motocrsFuture.tourYear.tour.name;
            tourYear = motocrsFuture.tourYear.year;
          }

          break;
        }

        case SportsTypes.FDRIFT: {
          if (eventId) {
            const fdriftEvent = await this.fdriftEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = fdriftEvent.tourYear.tour.name;
            tourYear = fdriftEvent.tourYear.year;
            eventName = fdriftEvent.name;
          } else if (futureId) {
            const fdriftFuture = await this.fdriftFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = fdriftFuture.tourYear.tour.name;
            tourYear = fdriftFuture.tourYear.year;
          }

          break;
        }

        case SportsTypes.F1: {
          if (eventId) {
            const f1Event = await this.f1EventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = f1Event.tourYear.tour.name;
            tourYear = f1Event.tourYear.year;
            eventName = f1Event.name;
          } else if (futureId) {
            const f1Future = await this.f1FuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = f1Future.tourYear.tour.name;
            tourYear = f1Future.tourYear.year;
          }

          break;
        }

        case SportsTypes.MotoGP: {
          if (eventId) {
            const mgEvent = await this.mgEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = mgEvent.tourYear.tour.name;
            tourYear = mgEvent.tourYear.year;
            eventName = mgEvent.name;
          } else if (futureId) {
            const mgFuture = await this.mgFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = mgFuture.tourYear.tour.name;
            tourYear = mgFuture.tourYear.year;
          }

          break;
        }

        case SportsTypes.MXGP: {
          if (eventId) {
            const mgEvent = await this.mxgpEventsRepository.findOne({
              where: {
                id: eventId,
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = mgEvent.tourYear.tour.name;
            tourYear = mgEvent.tourYear.year;
            eventName = mgEvent.name;
          } else if (futureId) {
            const mgFuture = await this.mxgpFuturesRepository.findOne({
              where: {
                id: futureId,
              },
              select: {
                id: true,
                type: true,
                tourYear: {
                  id: true,
                  year: true,
                  tour: {
                    id: true,
                    name: true,
                  },
                },
              },
              relations: ["tourYear.tour"],
            });
            tourName = mgFuture.tourYear.tour.name;
            tourYear = mgFuture.tourYear.year;
          }
          break;
        }

        default:
          break;
      }

      if (!rows.length) return false;

      const textMessage = this.generateTextMessage(
        sportType,
        tourName,
        tourYear,
        eventName,
        market,
        eventId,
        futureId,
      );

      console.log(
        "🚀 ~ file: notifications.service.ts:207 ~ NotificationsService ~ textMessage:",
        textMessage,
      );
      await Promise.all(
        rows.map(async (row) => {
          try {
            if (row.sms && row.client.phone && row.client.isPhoneVerified) {
              await this.twilioService.sendGenericMessage({
                country: row.client.country,
                message: textMessage,
                to: row.client.phone,
              });
            }
            if (row.email && row.client.isEmailVerified) {
              // currently not doing anything
            }
            if (row.slack) {
              // currently not doing anything
            }
          } catch (errSend) {
            throw errSend;
          }
        }),
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  private generateTextMessage(
    sportType: SportsTypes,
    tourName: string,
    tourYear: number,
    eventName: string,
    market: Markets,
    eventId?: string,
    futureId?: string,
  ): string {
    let marketName: string;
    let sportName: string;
    let frontendTabKey: FrontendOddPageParams;

    switch (market) {
      case Markets.EVENT_WINNER_PROJECTIONS:
        marketName = "Event Winner";
        frontendTabKey = FrontendOddPageParams.EVENT_WINNER;
        break;

      case Markets.EVENT_SECOND_PLACE_PROJECTIONS:
        marketName = "Second Place";
        frontendTabKey = FrontendOddPageParams.SECOND_PLACE;
        break;

      case Markets.HEAT_PROJECTIONS:
        marketName = "Heat Winner";
        frontendTabKey = FrontendOddPageParams.HEAT_WINNER;
        break;

      case Markets.PROP_BET_PROJECTIONS:
        marketName = "Prop Bets";
        frontendTabKey = FrontendOddPageParams.PROP_BETS;
        break;

      case Markets.HEAD_TO_HEAD_PROJECTIONS:
        marketName = "Head to Head";
        frontendTabKey = FrontendOddPageParams.HEAD_TO_HEAD;
        break;

      case Markets.PODIUM_PROJECTIONS:
        marketName = "To Podium";
        frontendTabKey = FrontendOddPageParams.PODIUMS;
        break;

      case Markets.SHOWS_PROJECTIONS:
        marketName = "To Show";
        frontendTabKey = FrontendOddPageParams.SHOWS;
        break;

      case Markets.DREAM_TEAM:
        marketName = "Dream Team";
        frontendTabKey = FrontendOddPageParams.DREAM_TEAM;
        break;

      case Markets.EXACTAS:
        marketName = "Exacta";
        frontendTabKey = FrontendOddPageParams.EXACTAS;
        break;

      case Markets.HEAT_EXACTAS:
        marketName = "Heat Exacta";
        frontendTabKey = FrontendOddPageParams.HEAT_EXACTAS;
        break;

      case Markets.FUTURES_WINNER:
        marketName = "Futures Winner";
        frontendTabKey = FrontendOddPageParams.FUTURES_WINNER;
        break;

      case Markets.FUTURES_TOP_2:
        marketName = "Futures Top 2";
        frontendTabKey = FrontendOddPageParams.FUTURES_TOP_2;
        break;

      case Markets.FUTURES_TOP_3:
        marketName = "Futures Top 3";
        frontendTabKey = FrontendOddPageParams.FUTURES_TOP_3;
        break;

      case Markets.FUTURES_TOP_5:
        marketName = "Futures Top 5";
        frontendTabKey = FrontendOddPageParams.FUTURES_TOP_5;
        break;

      case Markets.FUTURES_TOP_10:
        marketName = "Futures Top 10";
        frontendTabKey = FrontendOddPageParams.FUTURES_TOP_10;
        break;

      case Markets.FUTURES_MAKE_CUT:
        marketName = "Futures Makes Cut";
        frontendTabKey = FrontendOddPageParams.FUTURES_MAKE_CUT;
        break;

      case Markets.FUTURES_MAKE_PLAYOFFS:
        marketName = "Futures Makes Playoffs";
        frontendTabKey = FrontendOddPageParams.FUTURES_MAKE_PLAYOFFS;
        break;

      default:
        break;
    }

    switch (sportType) {
      case SportsTypes.SURFING:
        sportName = "Surfing";
        break;

      case SportsTypes.SKATEBOARDING:
        sportName = "Skateboarding";
        break;

      case SportsTypes.RALLYCROSS:
        sportName = "Nitrocross";
        break;

      case SportsTypes.SUPERCROSS:
        sportName = "Supercross";
        break;

      case SportsTypes.MASL:
        sportName = "MASL";
        break;

      case SportsTypes.FDRIFT:
        sportName = "Formula Drift";
        break;

      case SportsTypes.MOTOCROSS:
        sportName = "Pro Motocross";
        break;

      case SportsTypes.F1:
        sportName = "Formula 1";
        break;

      case SportsTypes.MotoGP:
        sportName = "Moto GP";
        break;

      case SportsTypes.MXGP:
        sportName = "Motocross World Championship";
        break;

      default:
        break;
    }

    if (eventId) {
      return `New odds published for ${sportName} > ${tourName} > ${tourYear} > ${eventName} > Market:${marketName}: ${this.clientHostUrl}/${sportType}/event/${eventId}?odd=${frontendTabKey}`;
    } else if (futureId) {
      return `New odds published for ${sportName} > ${tourName} > ${tourYear} > Market:${marketName}: ${this.clientHostUrl}/${sportType}/futures/${futureId}?odd=${frontendTabKey}`;
    } else {
      return "";
    }
  }
}
