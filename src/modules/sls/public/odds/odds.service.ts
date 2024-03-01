import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ProjectionEventOutcome from "../../../../entities/sls/projectionEventOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/sls/playerHeadToHeads.entity";
import PropBets from "../../../../entities/sls/propBets.entity";
import ProjectionEventShows from "../../../../entities/sls/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/sls/projectionEventPodiums.entity";

@Injectable()
export default class OddsService {
  constructor(
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    @InjectRepository(PropBets)
    private readonly propBetsRepository: Repository<PropBets>,
    @InjectRepository(ProjectionEventShows)
    private readonly projectionEventShowsRepository: Repository<ProjectionEventShows>,
    @InjectRepository(ProjectionEventPodiums)
    private readonly projectionEventPodiumsRepository: Repository<ProjectionEventPodiums>,
  ) {}

  public async fetchEventOdds(
    eventId: string,
    position: number,
  ): Promise<ProjectionEventOutcome[]> {
    const data = await this.projectionEventOutcomeRepository.find({
      where: {
        eventId,
        position,
      },
      relations: ["participant.athlete"],
      select: {
        id: true,
        eventId: true,
        position: true,
        odds: true,
        probability: true,
        participant: {
          id: true,
          eventId: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
      order: {
        probability: "DESC",
      },
    });

    return data;
  }

  // public async fetchHeatWinnerOdds(eventId: string): Promise<ProjectionEventHeatOutcome[]> {
  //   const data = await this.projectionEventHeatOutcomeRepository.find({
  //     where: {
  //       eventId,
  //     },
  //     relations: ["participant.athlete", "heat.round"],
  //     select: {
  //       id: true,
  //       eventId: true,
  //       position: true,
  //       odds: true,
  //       probability: true,
  //       participant: {
  //         id: true,
  //         eventId: true,
  //         athleteId: true,
  //         seedNo: true,
  //         athlete: {
  //           id: true,
  //           firstName: true,
  //           middleName: true,
  //           lastName: true,
  //           nationality: true,
  //           stance: true,
  //         },
  //       },
  //       heat: {
  //         id: true,
  //         eventId: true,
  //         heatName: true,
  //         heatNo: true,
  //         heatStatus: true,
  //         round: {
  //           id: true,
  //           roundNo: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });

  //   return data;
  // }

  public async fetchPropBets(eventId: string): Promise<PropBets[]> {
    const data = await this.propBetsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
        eventParticipant: {
          isActive: true,
          isArchived: false,
        },
      },
      relations: ["eventParticipant.athlete"],
      select: {
        id: true,
        eventId: true,
        proposition: true,
        odds: true,
        probability: true,
        voided: true,
        payout: true,
        eventParticipant: {
          id: true,
          eventId: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
    });

    return data;
  }

  public async fetchPlayerHeadToHeads(eventId: string): Promise<PlayerHeadToHeads[]> {
    const playerHeadToHeads = await this.playerHeadToHeadsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      relations: ["eventParticipant1.athlete", "eventParticipant2.athlete"],
      select: {
        id: true,
        eventId: true,
        player1Position: true,
        player1Odds: true,
        player2Position: true,
        player2Odds: true,
        player1Probability: true,
        player2Probability: true,
        eventParticipantWinnerId: true,
        voided: true,
        draw: true,
        eventParticipant1: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipant2: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
    });

    return playerHeadToHeads;
  }

  public async fetchEventShows(eventId: string): Promise<ProjectionEventShows[]> {
    const data = await this.projectionEventShowsRepository.find({
      where: {
        eventId,
      },
      relations: ["participant.athlete"],
      select: {
        id: true,
        eventId: true,
        odds: true,
        probability: true,
        participant: {
          id: true,
          eventId: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
      order: {
        probability: "DESC",
      },
    });

    return data;
  }

  public async fetchEventPodiums(eventId: string): Promise<ProjectionEventPodiums[]> {
    const data = await this.projectionEventPodiumsRepository.find({
      where: {
        eventId,
      },
      relations: ["participant.athlete"],
      select: {
        id: true,
        eventId: true,
        odds: true,
        probability: true,
        participant: {
          id: true,
          eventId: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
      order: {
        probability: "DESC",
      },
    });

    return data;
  }
}
