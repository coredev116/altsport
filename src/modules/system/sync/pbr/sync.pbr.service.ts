import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In, Not, IsNull, LessThanOrEqual } from "typeorm";
import uniq from "lodash.uniq";

import { isBefore, parseISO, addDays } from "date-fns";

import { v4 } from "uuid";

import Events from "../../../../entities/pbr/events.entity";
import Tours from "../../../../entities/pbr/tours.entity";
import TourYears from "../../../../entities/pbr/tourYears.entity";
import Rounds from "../../../../entities/pbr/rounds.entity";
import EventRounds from "../../../../entities/pbr/eventRounds.entity";
import Bulls from "../../../../entities/pbr/bulls.entity";
import Athletes from "../../../../entities/pbr/athletes.entity";
// import EventParticipants from "../../../../entities/pbr/eventParticipants.entity";
import Scores from "../../../../entities/pbr/scores.entity";

import PbrService from "../../../../services/pbr.service";

import { EventStatus, RoundStatus } from "../../../../constants/system";

@Injectable()
export default class SyncPbrService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    private readonly pbrService: PbrService,
  ) {}

  async addTourAndTourYear(
    transactionalEntityManager: EntityManager,
    tourProviderId: string,
    tourName: string,
    year: number,
  ) {
    const tourDb = await transactionalEntityManager.findOne(Tours, {
      where: {
        providerId: tourProviderId,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
      },
    });

    let tourId = tourDb?.id;

    if (!tourDb) {
      tourId = v4();
      await transactionalEntityManager.insert(Tours, {
        id: tourId,
        name: tourName,
        gender: "men",
        providerId: tourProviderId,
      });
    } else {
      await transactionalEntityManager.update(
        Tours,
        {
          id: tourId,
        },
        {
          name: tourName,
        },
      );
    }

    const tourYearDb = await transactionalEntityManager.findOne(TourYears, {
      where: {
        tourId,
        year,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
      },
    });

    let tourYearId = tourYearDb?.id;

    if (!tourYearDb) {
      tourYearId = v4();
      await transactionalEntityManager.insert(TourYears, {
        id: tourYearId,
        tourId,
        year,
      });
    }

    return {
      tourId,
      tourYearId,
    };
  }

  async syncScheduledEvents(): Promise<boolean> {
    await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const years = [2022, 2023, 2024];

          const rounds = await transactionalEntityManager.find(Rounds, {
            select: {
              id: true,
              name: true,
              roundNo: true,
            },
          });

          const existingRounds: {
            [key: string]: Partial<Rounds>;
          } = {};
          rounds.forEach((round) => {
            existingRounds[round.name] = round;
          });

          for await (const year of years) {
            const tourData = await this.pbrService.getTours(year);

            for await (const tour of tourData) {
              await this.addTourAndTourYear(
                transactionalEntityManager,
                String(tour.Series_ID),
                tour.Series_cd,
                Number(tour.Season_cd),
              );
            }

            const eventData = await this.pbrService.getEvents(year);

            for await (const event of eventData) {
              const scoresArray = [];

              const existingBulls: {
                [key: string]: Partial<Bulls>;
              } = {};

              const existingAthletes: {
                [key: string]: Partial<Athletes>;
              } = {};

              const eventDb = await transactionalEntityManager.findOne(Events, {
                where: {
                  providerId: String(event.Event_ID),
                  isActive: true,
                  isArchived: false,
                },
                select: {
                  id: true,
                },
              });

              let eventId = eventDb?.id;

              const tourResult = await this.addTourAndTourYear(
                transactionalEntityManager,
                String(event.Series_ID),
                event.Series,
                Number(event.Season),
              );

              let eventStatus = EventStatus.UPCOMING;
              if (
                isBefore(
                  parseISO(new Date(event.EventEndDt).toISOString()),
                  parseISO(new Date().toISOString()),
                )
              ) {
                eventStatus = EventStatus.COMPLETED;
              } else if (
                isBefore(
                  parseISO(new Date(event.EventStartDt).toISOString()),
                  parseISO(new Date().toISOString()),
                )
              ) {
                eventStatus = EventStatus.LIVE;
              }

              if (!eventDb) {
                eventId = v4();
                await transactionalEntityManager.insert(Events, {
                  id: eventId,
                  tourYearId: tourResult.tourYearId,
                  name: event.EventTitle,
                  startDate: event.EventStartDt,
                  endDate: event.EventEndDt,
                  eventLocation: event.EventLocation,
                  eventNumber: event.EventNo,
                  providerId: String(event.Event_ID),
                  eventStatus,
                });
              } else {
                await transactionalEntityManager.update(
                  Events,
                  {
                    providerId: String(event.Event_ID),
                    isActive: true,
                    isArchived: false,
                  },
                  {
                    tourYearId: tourResult.tourYearId,
                    name: event.EventTitle,
                    startDate: event.EventStartDt,
                    endDate: event.EventEndDt,
                    eventLocation: event.EventLocation,
                    eventNumber: event.EventNo,
                    eventStatus,
                  },
                );
              }

              const resultsData = await this.pbrService.getResults(event.Event_ID);

              for await (const roundData of resultsData.RoundResults) {
                let round: Partial<Rounds>;
                const parsedPeriod = roundData.EventRoundNo;
                // check to see if the round already exists, if not then insert it
                let eventRound: EventRounds;
                if (!existingRounds[parsedPeriod]) {
                  round = {
                    id: v4(),
                    name: `${parsedPeriod}`,
                    roundNo: Object.keys(existingRounds).length + 1,
                  };
                  await transactionalEntityManager.insert(Rounds, round);

                  // update the object since the same one is used later
                  existingRounds[parsedPeriod] = round;
                } else {
                  round = existingRounds[parsedPeriod];

                  eventRound = await transactionalEntityManager.findOne(EventRounds, {
                    where: {
                      eventId,
                      roundId: round.id,
                      isActive: true,
                      isArchived: false,
                    },
                    select: {
                      id: true,
                    },
                  });
                }

                if (!eventRound) {
                  let roundStatus = RoundStatus.UPCOMING;
                  if (
                    isBefore(
                      parseISO(new Date(event.EventEndDt).toISOString()),
                      parseISO(new Date().toISOString()),
                    )
                  ) {
                    roundStatus = RoundStatus.COMPLETED;
                  } else if (
                    isBefore(
                      parseISO(new Date(event.EventStartDt).toISOString()),
                      parseISO(new Date().toISOString()),
                    )
                  ) {
                    roundStatus = RoundStatus.LIVE;
                  }

                  await transactionalEntityManager.insert(EventRounds, {
                    eventId,
                    roundId: round.id,
                    startDate: event.EventStartDt,
                    endDate: event.EventEndDt,
                    roundStatus,
                  });
                }

                let bullProviderIds = [];
                let athleteProviderIds = [];
                roundData.Rides.forEach((ridesData) => {
                  if (!existingBulls[String(ridesData.Bull_ID)])
                    bullProviderIds.push(String(ridesData.Bull_ID));

                  if (!existingAthletes[String(ridesData.Rider_ID)])
                    athleteProviderIds.push(String(ridesData.Rider_ID));
                });

                bullProviderIds = uniq(bullProviderIds);
                if (bullProviderIds.length) {
                  const bullDb = await transactionalEntityManager.find(Bulls, {
                    where: {
                      providerId: In(bullProviderIds),
                      isActive: true,
                      isArchived: false,
                    },
                    select: {
                      id: true,
                      providerId: true,
                    },
                  });

                  bullDb.forEach((a) => {
                    existingBulls[a.providerId] = a;
                  });
                }

                const addBullArray = [];
                const bullPromises = bullProviderIds.map(async (bullProviderId) => {
                  if (!existingBulls[String(bullProviderId)]) {
                    const bullData = await this.pbrService.getBull(bullProviderId);

                    const id = v4();
                    addBullArray.push({
                      id,
                      name: bullData.BullName,
                      bullNo: bullData.BullNo,
                      weight: bullData.Weight,
                      birthDate: bullData.BirthDt,
                      providerId: String(bullProviderId),
                    });

                    existingBulls[String(bullProviderId)] = {
                      id,
                      providerId: String(bullProviderId),
                    };
                  }

                  return true;
                });

                await Promise.all(bullPromises);

                await transactionalEntityManager.insert(Bulls, addBullArray);

                athleteProviderIds = uniq(athleteProviderIds);
                if (athleteProviderIds.length) {
                  const athleteDb = await transactionalEntityManager.find(Athletes, {
                    where: {
                      providerId: In(athleteProviderIds),
                      isActive: true,
                      isArchived: false,
                    },
                    select: {
                      id: true,
                      providerId: true,
                    },
                  });

                  athleteDb.forEach((a) => {
                    existingAthletes[a.providerId] = a;
                  });
                }

                const addAthleteArray = [];
                const athletePromises = athleteProviderIds.map(async (athleteProviderId) => {
                  if (!existingAthletes[String(athleteProviderId)]) {
                    const athleteData = await this.pbrService.getAthlete(athleteProviderId);

                    const id = v4();
                    addAthleteArray.push({
                      id,
                      firstName: athleteData.FirstName,
                      middleName: athleteData.MiddleName,
                      lastName: athleteData.LastName,
                      dob: athleteData.BirthDt,
                      nationality: athleteData.HomeCountry,
                      gender: "male",
                      hometown: athleteData.HomeTown,
                      providerId: String(athleteProviderId),
                    });

                    existingAthletes[String(athleteProviderId)] = {
                      id,
                      providerId: String(athleteProviderId),
                    };
                  }

                  return true;
                });

                await Promise.all(athletePromises);

                await transactionalEntityManager.insert(Athletes, addAthleteArray);

                //FIXME: commenting this out temporarily
                /* const eventParticipantDb = await transactionalEntityManager.findOne(
                  EventParticipants,
                  {
                    where: {
                      eventId,
                      athleteId,
                      isActive: true,
                      isArchived: false,
                    },
                    select: {
                      id: true,
                    },
                  },
                );

                let eventParticipantId = athleteDb?.id;
                if (!eventParticipantDb) {
                  eventParticipantId = v4();
                  await transactionalEntityManager.insert(EventParticipants, {
                    id: eventParticipantId,
                    eventId,
                    athleteId,
                  });
                } */

                roundData.Rides.forEach((ridesData) => {
                  scoresArray.push({
                    eventId,
                    roundId: round.id,
                    athleteId: existingAthletes[String(ridesData.Rider_ID)].id,
                    bullId: existingBulls[String(ridesData.Bull_ID)].id,
                    riderScore: ridesData.RiderScore,
                    bullScore: ridesData.BullScore,
                  });
                });
              }

              await transactionalEntityManager.upsert(Scores, scoresArray, {
                conflictPaths: ["eventId", "roundId", "athleteId", "bullId"],
              });
            }
          }

          return true;
        } catch (error) {
          throw error;
        }
      },
    );

    return true;
  }

  async syncLiveEvents(): Promise<boolean> {
    await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const now: Date = new Date();
          const endDate: Date = addDays(now, 8);

          const [rounds, dbEvents] = await Promise.all([
            transactionalEntityManager.find(Rounds, {
              select: {
                id: true,
                name: true,
                roundNo: true,
              },
            }),
            this.eventsRepository.find({
              where: {
                eventStatus: In([EventStatus.LIVE, EventStatus.UPCOMING, EventStatus.NEXT]),
                isActive: true,
                isArchived: false,
                providerId: Not(IsNull()),
                startDate: LessThanOrEqual(endDate),
              },
              select: {
                id: true,
                providerId: true,
                eventStatus: true,
              },
            }),
          ]);

          const existingRounds: {
            [key: string]: Partial<Rounds>;
          } = {};
          rounds.forEach((round) => {
            existingRounds[round.name] = round;
          });

          for await (const dbEvent of dbEvents) {
            const resultsData = await this.pbrService.getResults(Number(dbEvent.providerId));

            let eventStatus = EventStatus.UPCOMING;
            if (
              isBefore(
                parseISO(new Date(resultsData.EventDetails.EventEndDt).toISOString()),
                parseISO(new Date().toISOString()),
              )
            ) {
              eventStatus = EventStatus.COMPLETED;
            } else if (
              isBefore(
                parseISO(new Date(resultsData.EventDetails.EventStartDt).toISOString()),
                parseISO(new Date().toISOString()),
              )
            ) {
              eventStatus = EventStatus.LIVE;
            }

            await transactionalEntityManager.update(
              Events,
              {
                id: dbEvent.id,
              },
              {
                startDate: resultsData.EventDetails.EventStartDt,
                endDate: resultsData.EventDetails.EventEndDt,
                eventStatus,
              },
            );

            const existingBulls: {
              [key: string]: Partial<Bulls>;
            } = {};

            const existingAthletes: {
              [key: string]: Partial<Athletes>;
            } = {};

            const scoresArray = [];
            let bullProviderIds = [];
            let athleteProviderIds = [];
            for await (const roundData of resultsData.RoundResults) {
              let roundStatus = RoundStatus.UPCOMING;
              if (
                isBefore(
                  parseISO(new Date(resultsData.EventDetails.EventEndDt).toISOString()),
                  parseISO(new Date().toISOString()),
                )
              ) {
                roundStatus = RoundStatus.COMPLETED;
              } else if (
                isBefore(
                  parseISO(new Date(resultsData.EventDetails.EventStartDt).toISOString()),
                  parseISO(new Date().toISOString()),
                )
              ) {
                roundStatus = RoundStatus.LIVE;
              }

              await transactionalEntityManager.update(
                EventRounds,
                {
                  eventId: dbEvent.id,
                  roundId: existingRounds[roundData.EventRoundNo].id,
                  isActive: true,
                  isArchived: false,
                },
                {
                  startDate: resultsData.EventDetails.EventStartDt,
                  endDate: resultsData.EventDetails.EventEndDt,
                  roundStatus,
                },
              );

              roundData.Rides.forEach((ridesData) => {
                if (!existingBulls[String(ridesData.Bull_ID)])
                  bullProviderIds.push(String(ridesData.Bull_ID));

                if (!existingAthletes[String(ridesData.Rider_ID)])
                  athleteProviderIds.push(String(ridesData.Rider_ID));
              });

              bullProviderIds = uniq(bullProviderIds);
              if (bullProviderIds.length) {
                const bullDb = await transactionalEntityManager.find(Bulls, {
                  where: {
                    providerId: In(bullProviderIds),
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    providerId: true,
                  },
                });

                bullDb.forEach((a) => {
                  existingBulls[a.providerId] = a;
                });
              }

              athleteProviderIds = uniq(athleteProviderIds);
              if (athleteProviderIds.length) {
                const athleteDb = await transactionalEntityManager.find(Athletes, {
                  where: {
                    providerId: In(athleteProviderIds),
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    providerId: true,
                  },
                });

                athleteDb.forEach((a) => {
                  existingAthletes[a.providerId] = a;
                });
              }

              roundData.Rides.forEach((ridesData) => {
                scoresArray.push({
                  eventId: dbEvent.id,
                  roundId: existingRounds[roundData.EventRoundNo].id,
                  athleteId: existingAthletes[String(ridesData.Rider_ID)].id,
                  bullId: existingBulls[String(ridesData.Bull_ID)].id,
                  riderScore: ridesData.RiderScore,
                  bullScore: ridesData.BullScore,
                });
              });
            }

            await transactionalEntityManager.upsert(Scores, scoresArray, {
              conflictPaths: ["eventId", "roundId", "athleteId", "bullId"],
            });
          }
        } catch (error) {
          throw error;
        }
      },
    );

    return true;
  }
}
