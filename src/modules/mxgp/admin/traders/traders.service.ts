import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Events from "../../../../entities/mxgp/events.entity";
import EventParticipants from "../../../../entities/mxgp/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/mxgp/playerHeadToHeads.entity";

import ClientPlayerHeadToHeads from "../../../../entities/mxgp/clientPlayerHeadToHeads.entity";

import { SportsTypes, OddMarkets, SportsDbSchema } from "../../../../constants/system";

import QueueService from "../../../system/queue/queue.service";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    private queueService: QueueService,
  ) {}

  async fetchEventParticipant(
    eventId: string,
    includeArchived = false,
  ): Promise<EventParticipants[]> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
      },
      select: ["id"],
    });

    if (!event) {
      throw eventExceptions.eventNotFound({
        eventId,
      });
    }

    const eventParticipants = await this.eventParticipantsRepository.find({
      where: !includeArchived
        ? {
            eventId,
            isActive: true,
            isArchived: false,
          }
        : [
            {
              eventId,
              isActive: true,
              isArchived: false,
            },
            {
              eventId,
              isActive: false,
              isArchived: true,
            },
          ],
      relations: ["event.tourYear.tour", "athlete"],
      select: {
        id: true,
        seedNo: true,
        baseProjection: true,
        status: true,
        event: {
          id: true,
          name: true,
          eventStatus: true,
          eventLocation: true,
          tourYear: {
            id: true,
            tourId: true,
            year: true,
            tour: {
              name: true,
              gender: true,
            },
          },
        },
        athlete: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          nationality: true,
          stance: true,
          playerStatus: true,
          gender: true,
        },
      },
      order: {
        seedNo: "ASC",
      },
    });

    return eventParticipants;
  }

  async oddsGoLive(eventId: string, projectionType: OddMarkets): Promise<boolean> {
    await this.playerHeadToHeadsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        switch (projectionType) {
          case OddMarkets.EVENT_WINNER_PROJECTIONS:
            break;

          case OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS:
            break;

          case OddMarkets.HEAT_PROJECTIONS:
            break;

          case OddMarkets.PROP_BET_PROJECTIONS:
            // TODO: add prop bets for formula drift
            break;

          case OddMarkets.HEAD_TO_HEAD_PROJECTIONS:
            const playerHeadToHeadsData = await transactionalEntityManager.findOne(
              PlayerHeadToHeads,
              {
                where: {
                  eventId,
                  visible: true,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!playerHeadToHeadsData) return;

            await transactionalEntityManager.update(
              ClientPlayerHeadToHeads,
              {
                eventId,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.MXGP}."clientPlayerHeadToHeads"("eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage")
              SELECT "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage" FROM ${SportsDbSchema.MXGP}."playerHeadToHeads"
              WHERE ${SportsDbSchema.MXGP}."playerHeadToHeads"."eventId" = '${eventId}' AND ${SportsDbSchema.MXGP}."playerHeadToHeads"."visible" = true;
            `);
            break;

          case OddMarkets.PODIUM_PROJECTIONS:
            // TODO: add podiums for formula drift
            break;

          case OddMarkets.SHOWS_PROJECTIONS:
            // TODO: add prop bets for formula drift
            break;

          default:
            break;
        }

        if (projectionType !== OddMarkets.HEAT_PROJECTIONS)
          await this.queueService.notifyMarketPublishNotification({
            eventId,
            sportType: SportsTypes.MXGP,
            market: projectionType,
          });
      },
    );

    return true;
  }
}
