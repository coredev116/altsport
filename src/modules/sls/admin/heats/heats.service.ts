import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import Events from "../../../../entities/sls/events.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";

import { HeatDto } from "./dto/heats.dto";

import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";

import { HeatStatus } from "../../../../constants/system";

@Injectable()
export class HeatsService {
  constructor(
    @InjectRepository(RoundHeats) private readonly heatRepository: Repository<RoundHeats>,
    @InjectRepository(Rounds) private readonly roundRepository: Repository<Rounds>,
    @InjectRepository(EventRounds) private readonly eventRoundRepository: Repository<EventRounds>,
  ) {}

  async createHeat(body: HeatDto): Promise<boolean> {
    await this.roundRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            const [event] = await Promise.all([
              transactionalEntityManager.findOne(Events, {
                where: {
                  name: item.eventName,
                  leagueYear: {
                    year: item.year,
                    league: {
                      gender: item.gender,
                    },
                  },
                },
                select: {
                  id: true,
                  name: true,
                  leagueYear: {
                    year: true,
                  },
                },
                relations: ["leagueYear"],
              }),
              // transactionalEntityManager.findOne(Rounds, {
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

            let heat = await transactionalEntityManager.findOne(RoundHeats, {
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
