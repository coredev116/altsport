import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import League from "../../../../entities/sls/leagues.entity";

@Injectable()
export default class LeagueService {
  constructor(@InjectRepository(League) private readonly leagueRepository: Repository<League>) {}

  public async fetchLeagues(year?: number): Promise<League[]> {
    let where: FindOptionsWhere<League> = {
      isActive: true,
      isArchived: false,
    };

    if (year)
      where = {
        ...where,
        years: {
          year,
        },
      };

    const leagues = await this.leagueRepository.find({
      where,
      select: {
        id: true,
        name: true,
        gender: true,
        years: {
          year: true,
        },
      },
      relations: ["years"],
      order: {
        id: "DESC",
      },
    });

    return leagues;
  }
}
