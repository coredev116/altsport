import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Athletes from "../../../../entities/sls/athletes.entity";
import EventResults from "../../../../entities/sls/eventResults.entity";

@Injectable()
export default class ResultService {
  constructor(
    @InjectRepository(EventResults)
    private readonly eventResultsRepository: Repository<EventResults>,
  ) {}

  public async fetchEventResults(limit: number, startingAfter?: string, eventId?: string) {
    const query = this.eventResultsRepository.createQueryBuilder("eventResults");

    query.leftJoin(Athletes, "athletes", "eventResults.athleteId = athletes.id");

    query.where("athletes.isActive = :isActive", { isActive: true });
    query.andWhere("athletes.isArchived = :isArchived", { isArchived: false });

    if (eventId) {
      query.andWhere("eventResults.eventId = :eventId", {
        eventId,
      });
    }

    if (startingAfter) query.andWhere("eventResults.id < :startingAfter", { startingAfter });

    query.select([
      "eventResults.id",
      "athletes.firstName",
      "athletes.middleName",
      "athletes.lastName",
      "eventResults.eventRank",
      "eventResults.eventPoints",
    ]);

    query.limit(limit);

    let result = await query.getRawMany();

    return result;
  }
}
