import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import Leagues from "../../../../entities/sls/leagues.entity";
import LeagueYears from "../../../../entities/sls/leagueYears.entity";

import LeagueDto from "./dto/leagues.dto";

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Leagues) private readonly leagueRepository: Repository<Leagues>,
    @InjectRepository(LeagueYears) private readonly leagueYearRepository: Repository<LeagueYears>,
  ) {}

  async createLeague(body: LeagueDto): Promise<boolean> {
    await this.leagueRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            let league = await transactionalEntityManager.findOne(Leagues, {
              where: { name: item.name, gender: item.gender },
              select: {
                id: true,
                years: {
                  id: true,
                  year: true,
                },
              },
              relations: ["years"],
            });

            if (!league) {
              // league does not exist, add a new one
              const newLeague = this.leagueRepository.create({
                name: item.name,
                gender: item.gender,
                years: [
                  {
                    year: item.year,
                  },
                ],
              });

              league = await transactionalEntityManager.save(newLeague);
            } else {
              // league exists, check if the year exists for that league as well
              const year = league.years?.find((leagueYear) => leagueYear.year === item.year);
              if (!year) {
                // add the year for that league
                const createdLeagueYear = this.leagueYearRepository.create({
                  leagueId: league.id,
                  year: item.year,
                });
                await transactionalEntityManager.save(createdLeagueYear);
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
