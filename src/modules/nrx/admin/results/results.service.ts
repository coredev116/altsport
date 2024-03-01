import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import Events from "../../../../entities/nrx/events.entity";
import Athletes from "../../../../entities/nrx/athletes.entity";
import EventResults from "../../../../entities/nrx/eventResults.entity";

import ResultDto from "./dto/results.dto";

import * as eventExceptions from "../../../../exceptions/events";
import * as athleteExceptions from "../../../../exceptions/athletes";

@Injectable()
export default class ResultService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Athletes) private readonly athleteRepository: Repository<Athletes>,
    @InjectRepository(EventResults)
    private readonly eventResultsRepository: Repository<EventResults>,
  ) {}

  async createEventResults(body: ResultDto): Promise<boolean> {
    await this.eventResultsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            const event = await this.eventsRepository.findOne({
              where: {
                name: item.eventName,
                tourYear: {
                  year: item.eventYear,
                },
              },
              select: {
                id: true,
                name: true,
                tourYear: {
                  year: true,
                },
              },
              relations: ["tourYear"],
            });
            if (!event) throw eventExceptions.eventNotFound(item);

            const athleteQuery = this.athleteRepository
              .createQueryBuilder()
              .select(["id"])
              .where(`LOWER("firstName") = LOWER(:firstName)`, {
                firstName: item.firstName,
              });
            if (item.middleName)
              athleteQuery.andWhere(`LOWER("middleName") = LOWER(:middleName)`, {
                middleName: item.middleName,
              });
            if (item.lastName)
              athleteQuery.andWhere(`LOWER("lastName") = LOWER(:lastName)`, {
                lastName: item.lastName,
              });
            const athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();
            if (!athlete) throw athleteExceptions.athleteNotFound(item);

            let eventResult = await this.eventResultsRepository.findOne({
              where: {
                athleteId: athlete.id,
                eventId: event.id,
              },
              select: ["id"],
            });

            if (!eventResult) {
              const newEventResult = this.eventResultsRepository.create({
                athleteId: athlete.id,
                eventId: event.id,
                eventRank: item.eventRank,
                eventPoints: item.eventPoints,
              });

              eventResult = await transactionalEntityManager.save(newEventResult);
            } else {
              const eventResultUpdateObj: Partial<EventResults> = {
                eventRank: item.eventRank,
                eventPoints: item.eventPoints,
              };

              await transactionalEntityManager.update(
                EventResults,
                {
                  id: eventResult.id,
                },
                eventResultUpdateObj,
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
