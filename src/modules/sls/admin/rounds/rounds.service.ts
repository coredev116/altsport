import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import EventRounds from "../../../../entities/sls/eventRounds.entity";
import Events from "../../../../entities/sls/events.entity";
import Rounds from "../../../../entities/sls/rounds.entity";

import { RoundDto } from "./dto/rounds.dto";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Rounds)
    private readonly roundRepository: Repository<Rounds>,
    @InjectRepository(EventRounds)
    private readonly eventRoundRepository: Repository<EventRounds>,
  ) {}

  async createRound(body: RoundDto): Promise<boolean> {
    await this.roundRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            // eslint-disable-next-line prefer-const
            let [event, round] = await Promise.all([
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
                    id: true,
                    year: true,
                  },
                },
                relations: ["leagueYear"],
              }),
              transactionalEntityManager.findOne(Rounds, {
                where: { name: item.name, roundNo: item.roundNo },
                select: {
                  id: true,
                  roundNo: true,
                  eventRounds: {
                    id: true,
                    roundId: true,
                    eventId: true,
                  },
                },
                relations: ["eventRounds"],
              }),
            ]);
            if (!event) throw eventExceptions.eventNotFound(item);

            if (!round) {
              // round does not exist, add a new one
              const newRound = this.roundRepository.create({
                name: item.name,
                roundNo: item.roundNo,
                eventRounds: [
                  {
                    eventId: event.id,
                    roundStatus: item.roundStatus,
                  },
                ],
              });

              round = await transactionalEntityManager.save(newRound);
            } else {
              // round exists, check if it is associated with an event
              const eventRound = round.eventRounds?.find(
                (itemRound) => itemRound.eventId === event.id,
              );
              if (!eventRound) {
                // associate the round with the event
                const createdEventRound = this.eventRoundRepository.create({
                  eventId: event.id,
                  roundId: round.id,
                  roundStatus: item.roundStatus,
                });
                await transactionalEntityManager.save(createdEventRound);
              } else {
                const eventRoundUpdateObj: Partial<EventRounds> = {
                  roundStatus: item.roundStatus,
                };
                if (item.startDate) eventRoundUpdateObj.startDate = item.startDate;
                if (item.endDate) eventRoundUpdateObj.endDate = item.endDate;

                await transactionalEntityManager.update(
                  EventRounds,
                  {
                    id: eventRound.id,
                  },
                  eventRoundUpdateObj,
                );
              }
            }
          } catch (error) {
            throw error;
          }
        }

        return true;
      },
    );

    return true;
  }
}
