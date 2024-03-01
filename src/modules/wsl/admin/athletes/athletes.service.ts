import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import AthleteDto from "./dto/athletes.dto";
import Athletes from "../../../../entities/wsl/athletes.entity";

@Injectable()
export default class AthleteService {
  constructor(
    @InjectRepository(Athletes)
    private readonly athleteRepository: Repository<Athletes>,
  ) {}

  public async fetchAthletes(): Promise<Athletes[]> {
    const users = await this.athleteRepository.find();

    return users;
  }

  async createAthlete(body: AthleteDto): Promise<boolean> {
    try {
      const athletes = body.items.map((athlete) => this.athleteRepository.create(athlete));
      await this.athleteRepository.save(athletes);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
