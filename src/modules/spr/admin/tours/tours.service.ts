import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Tour from "../../../../entities/spr/tours.entity";
import TourYears from "../../../../entities/spr/tourYears.entity";

import TourDto from "./dto/tours.dto";

@Injectable()
export default class TourService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(TourYears) private readonly tourYearRepository: Repository<TourYears>,
  ) {}

  async createTour(body: TourDto): Promise<boolean> {
    await this.tourRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const item of body.items) {
          try {
            let tour = await transactionalEntityManager.findOne(Tour, {
              where: { name: item.name, gender: item.gender },
              relations: ["years"],
            });

            if (!tour) {
              // tour does not exist, add a new one
              const newTour = this.tourRepository.create({
                name: item.name,
                gender: item.gender,
                years: [
                  {
                    year: item.year,
                  },
                ],
              });

              tour = await transactionalEntityManager.save(newTour);
            } else {
              // tour exists, check if the year exists for that tour as well
              const year = tour.years?.find((tourYear) => tourYear.year === item.year);
              if (!year) {
                // add the year for that tour
                const createdTourYear = this.tourYearRepository.create({
                  tourId: tour.id,
                  year: item.year,
                });
                await transactionalEntityManager.save(createdTourYear);
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
