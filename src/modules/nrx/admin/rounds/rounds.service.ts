import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Rounds from "../../../../entities/nrx/rounds.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";
import Events from "../../../../entities/nrx/events.entity";

import RoundDto from "./dto/rounds.dto";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export default class RoundService {
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
                    id: true,
                    year: true,
                  },
                },
                relations: ["tourYear"],
              }),
              transactionalEntityManager.findOne(Rounds, {
                where: { name: item.name, roundNo: +item.roundNo },
                // where: { name: item.name },
                select: {
                  id: true,
                  roundNo: true,
                  roundType: true,
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
                roundNo: +item.roundNo,
                roundType: item.roundType,
                eventRounds: [
                  {
                    eventId: event.id,
                    roundStatus: item.roundStatus,
                  },
                ],
              });

              round = await transactionalEntityManager.save(newRound);
            } else {
              // backward compatibility
              if (!round.roundType && item.roundType)
                await transactionalEntityManager.update(
                  Rounds,
                  {
                    id: round.id,
                  },
                  {
                    roundType: item.roundType,
                  },
                );

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
      },
    );

    return true;
  }
}
