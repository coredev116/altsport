import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import RoundHeats from "../../../../entities/spr/roundHeats.entity";
import Round from "../../../../entities/spr/rounds.entity";
import Event from "../../../../entities/spr/events.entity";
import EventRounds from "../../../../entities/spr/eventRounds.entity";

import HeatDto from "./dto/heats.dto";

import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";

import { HeatStatus } from "../../../../constants/system";

@Injectable()
export default class HeatService {
  constructor(
    @InjectRepository(Event) private readonly eventsRepository: Repository<Event>,
    @InjectRepository(RoundHeats) private readonly heatRepository: Repository<RoundHeats>,
    @InjectRepository(Round) private readonly roundRepository: Repository<Round>,
    @InjectRepository(EventRounds) private readonly eventRoundRepository: Repository<EventRounds>,
  ) {}

  async createHeat(body: HeatDto): Promise<boolean> {
    await this.roundRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            const [event] = await Promise.all([
              this.eventsRepository.findOne({
                where: {
                  name: item.eventName,
                  tourYear: {
                    year: item.year,
                    tour: {
                      name: item.tourName,
                      gender: item.gender,
                    },
                  },
                  isActive: true,
                  isArchived: false,
                },
                select: {
                  id: true,
                  name: true,
                  tourYear: {
                    year: true,
                  },
                },
                relations: ["tourYear"],
              }),
              // transactionalEntityManager.findOne(Round, {
              //   where: { name: item.roundName },
              //   select: ["id"],
              // }),
            ]);
            if (!event) throw eventExceptions.eventNotFound(item);

            const eventRound = await this.eventRoundRepository.findOne({
              where: {
                eventId: event.id,
                round: {
                  name: item.roundName,
                },
              },
              relations: ["round"],
              select: {
                id: true,
                eventId: true,
                round: {
                  id: true,
                  roundNo: true,
                  name: true,
                },
              },
            });
            if (!eventRound) throw roundExceptions.roundNotFound(item);

            let heat = await this.heatRepository.findOne({
              where: {
                heatName: item.heatName,
                eventId: event.id,
                roundId: eventRound.round.id,
                heatNo: item.heatNo,
              },
              select: ["id"],
            });

            if (!heat) {
              // heat does not exist, add a new one
              const newHeat = this.heatRepository.create({
                heatName: item.heatName,
                eventId: event.id,
                roundId: eventRound.round.id,
                heatNo: item.heatNo,
                heatStatus: item.heatStatus,
                startDate: item.startDate || null,
                endDate: item.endDate || null,
              });

              heat = await transactionalEntityManager.save(newHeat);
            } else {
              const heatUpdateObj: Partial<RoundHeats> = {
                heatNo: item.heatNo,
                heatName: item.heatName,
                heatStatus: item.heatStatus,
                isHeatWinnerMarketOpen: [
                  HeatStatus.LIVE,
                  HeatStatus.NEXT,
                  HeatStatus.UPCOMING,
                ].includes(item.heatStatus),
              };
              if (item.startDate) heatUpdateObj.startDate = item.startDate;
              if (item.endDate) heatUpdateObj.endDate = item.endDate;

              await transactionalEntityManager.update(
                RoundHeats,
                {
                  id: heat.id,
                },
                heatUpdateObj,
              );
            }
          } catch (error) {
            throw error;
          }
        }
      },
    );

    return true;
  }
}
