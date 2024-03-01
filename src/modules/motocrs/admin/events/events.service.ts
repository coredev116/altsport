import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In } from "typeorm";

import Event from "../../../../entities/motocrs/events.entity";
import TourYear from "../../../../entities/motocrs/tourYears.entity";
import Scores from "../../../../entities/motocrs/scores.entity";
import EventRounds from "../../../../entities/motocrs/eventRounds.entity";
import RoundHeats from "../../../../entities/motocrs/roundHeats.entity";

import { RoundStatus, EventStatus } from "../../../../constants/system";

import UpdateEventDto from "./dto/updateEvent.dto";

import * as tourExceptions from "../../../../exceptions/tours";

@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats) private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
  ) {}

  async fetchEvents(eventStatus: EventStatus[]): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: {
        eventStatus: In(eventStatus),
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventNumber: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        isSimulationEnabled: true,
        tourYear: {
          id: true,
          year: true,
          tourId: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
      },
    });

    return events;
  }

  async fetchEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ["tourYear.tour", "rounds.round.heats"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventNumber: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        isSimulationEnabled: true,
        tourYear: {
          year: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
        rounds: {
          id: true,
          eventId: true,
          roundId: true,
          roundStatus: true,
          startDate: true,
          endDate: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            heats: {
              id: true,
              eventId: true,
              heatName: true,
              heatNo: true,
              heatStatus: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
    });

    return event;
  }

  async updateEvent(eventId: string, updateObj: UpdateEventDto): Promise<boolean> {
    return this.eventRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const tourYear = await transactionalEntityManager.findOne(TourYear, {
          where: { id: updateObj.tourYearId },
        });
        if (!tourYear) throw tourExceptions.tourYearNotFound;

        await transactionalEntityManager.update(
          Event,
          {
            id: eventId,
          },
          updateObj,
        );

        return true;
      },
    );
  }

  async fetchEventMinimal(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        winnerAthleteId: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        isSimulationEnabled: true,
      },
    });

    return event;
  }

  public async fetchEventPositionParticipant(eventId: string, position: number): Promise<string> {
    // find the last round for the given event
    const lastEventRound = await this.eventRoundsRepository.findOne({
      where: {
        eventId,
      },
      select: {
        id: true,
        roundId: true,
        roundStatus: true,
        round: {
          id: true,
          roundNo: true,
        },
      },
      relations: ["round"],
      order: {
        round: {
          roundNo: "DESC",
        },
      },
    });
    if (!lastEventRound) return null;
    if (lastEventRound.roundStatus !== RoundStatus.COMPLETED) return null;

    const heat = await this.roundHeatsRepository.findOne({
      where: {
        eventId,
        roundId: lastEventRound.roundId,
      },
      select: {
        id: true,
      },
    });
    if (!heat) return null;

    const score = await this.scoresRepository.findOne({
      where: {
        roundHeatId: heat.id,
        eventId,
        heatPosition: position,
      },
      select: {
        athleteId: true,
      },
    });
    if (!score) return null;

    return score.athleteId;
  }
}
