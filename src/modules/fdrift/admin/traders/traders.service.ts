import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Events from "../../../../entities/fdrift/events.entity";
import EventParticipants from "../../../../entities/fdrift/eventParticipants.entity";

import ProjectionEventHeatOutcome from "../../../../entities/fdrift/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/fdrift/projectionEventOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/fdrift/playerHeadToHeads.entity";

import ClientProjectionEventOutcome from "../../../../entities/fdrift/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/fdrift/clientPlayerHeadToHeads.entity";

import { SportsTypes, OddMarkets, SportsDbSchema } from "../../../../constants/system";

import QueueService from "../../../system/queue/queue.service";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,
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
        notes: true,
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
          yearStatus: true,
          gender: true,
        },
      },
      order: {
        seedNo: "ASC",
      },
    });

    return eventParticipants;
  }

  async oddsGoLive(
    eventId: string,
    projectionType: OddMarkets,
    roundHeatId: string,
    roundId: string,
  ): Promise<boolean> {
    await this.projectionEventOutcomeRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        switch (projectionType) {
          case OddMarkets.EVENT_WINNER_PROJECTIONS:
            const projectionEventOutcomeData = await transactionalEntityManager.findOne(
              ProjectionEventOutcome,
              {
                where: {
                  eventId,
                  position: 1,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventOutcomeData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventOutcome,
              {
                eventId,
                position: 1,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.FDRIFT}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.FDRIFT}."projectionEventOutcome"
              WHERE ${SportsDbSchema.FDRIFT}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.FDRIFT}."projectionEventOutcome"."position" = 1;
            `);

            break;

          case OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS:
            const projectionEventSecondOutcomeData = await transactionalEntityManager.findOne(
              ProjectionEventOutcome,
              {
                where: {
                  eventId,
                  position: 2,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventSecondOutcomeData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventOutcome,
              {
                eventId,
                position: 2,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.FDRIFT}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.FDRIFT}."projectionEventOutcome"
              WHERE ${SportsDbSchema.FDRIFT}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.FDRIFT}."projectionEventOutcome"."position" = 2;
            `);
            break;

          case OddMarkets.HEAT_PROJECTIONS:
            if (roundId) {
              // assumption here is that the heats have been published
              // client is trying to notify the client

              await this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.FDRIFT,
                market: projectionType,
              });
            } else {
              const projectionEventHeatOutcomeData = await transactionalEntityManager.findOne(
                ProjectionEventHeatOutcome,
                {
                  where: {
                    eventId,
                    roundHeatId,
                    isActive: true,
                  },
                  select: {
                    isActive: true,
                  },
                },
              );
              if (!projectionEventHeatOutcomeData) return;

              await transactionalEntityManager.update(
                ClientProjectionEventHeatOutcome,
                {
                  eventId,
                  roundHeatId,
                },
                {
                  isActive: false,
                  isArchived: true,
                },
              );

              await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.FDRIFT}."clientProjectionEventHeatOutcome"("eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.FDRIFT}."projectionEventHeatOutcome"
              WHERE ${SportsDbSchema.FDRIFT}."projectionEventHeatOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.FDRIFT}."projectionEventHeatOutcome"."roundHeatId" = '${roundHeatId}';
            `);
            }

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
              INSERT INTO ${SportsDbSchema.FDRIFT}."clientPlayerHeadToHeads"("eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage")
              SELECT "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage" FROM ${SportsDbSchema.FDRIFT}."playerHeadToHeads"
              WHERE ${SportsDbSchema.FDRIFT}."playerHeadToHeads"."eventId" = '${eventId}' AND ${SportsDbSchema.FDRIFT}."playerHeadToHeads"."visible" = true;
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
            sportType: SportsTypes.FDRIFT,
            market: projectionType,
          });
      },
    );

    return true;
  }
}
