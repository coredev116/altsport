import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import Tour from "../../../../entities/nrx/tours.entity";

@Injectable()
export default class TourService {
  constructor(@InjectRepository(Tour) private readonly tourRepository: Repository<Tour>) {}

  public async fetchTours(year?: number): Promise<Tour[]> {
    let where: FindOptionsWhere<Tour> = {
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

    const tours = await this.tourRepository.find({
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

    return tours;
  }
}
