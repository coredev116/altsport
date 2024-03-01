import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { parse, parseISO, differenceInDays, isAfter } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import IEvent from "../interfaces/sls/api/event";
import IParsedEventContest from "../interfaces/sls/api/parsedContest";
import IEventContest, { IEventContestCategory } from "../interfaces/sls/api/contents";

import { Gender, EventStatus, RoundStatus, HeatStatus } from "../constants/system";

import { generateUniqueCode } from "../helpers/strings.helper";

@Injectable()
export default class SLSAPIService {
  private apiInstance: AxiosInstance;

  constructor() {
    const baseUrl = "https://live.rawmotion.com/api/v1";

    this.apiInstance = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
    });
  }

  async fetchEventSummary(externalEventId: string): Promise<IEvent> {
    try {
      const { data } = await this.apiInstance.get<IEvent[]>(`event/${externalEventId}`);

      return data.length === 1 ? data[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async fetchEventContest(
    externalEventId: string,
    contestId: string,
  ): Promise<IParsedEventContest> {
    try {
      const { data } = await this.apiInstance.get<IEventContest[]>(
        `event/${externalEventId}/contest/${contestId}`,
      );

      const eventSummary = await this.fetchEventSummary(externalEventId);

      const parsedData = data ? this.parseEventContests(data, eventSummary) : [];

      return parsedData.length ? parsedData[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async fetchEventContests(externalEventId: string): Promise<IParsedEventContest[]> {
    try {
      const { data } = await this.apiInstance.get<IEventContest[]>(
        `event/${externalEventId}/contests`,
      );

      const eventSummary = await this.fetchEventSummary(externalEventId);

      return this.parseEventContests(data, eventSummary);
    } catch (error) {
      throw error;
    }
  }

  async fetchEventsByYear(year: number): Promise<IEvent[]> {
    try {
      const { data } = await this.apiInstance.get<IEvent[]>("/events", {
        params: {
          year,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  private parseEventContests(contents: IEventContest[], apiEvent: IEvent): IParsedEventContest[] {
    try {
      const womensEvent = contents.find((rowContest) => {
        const cleanedName = rowContest.name.replaceAll(/[^a-zA-Z ]/g, "");
        return ["Womens", "Women"].includes(cleanedName);
      });
      const mensEvent = contents.find((rowContest) => {
        const cleanedName = rowContest.name.replaceAll(/[^a-zA-Z ]/g, "");
        return ["Mens", "Men"].includes(cleanedName);
      });

      const events: {
        gender: Gender;
        event: IEventContest;
      }[] = [];

      if (womensEvent)
        events.push({
          event: womensEvent,
          gender: Gender.FEMALE,
        });
      if (mensEvent)
        events.push({
          event: mensEvent,
          gender: Gender.MALE,
        });

      const now: Date = new Date();

      // individual start and end dates are broken so using the start and end at the event level
      const parsedEvents = events
        .map(({ event, gender }) => {
          const parseableStartDate = apiEvent?.date?.start || event?.date?.start;
          const parseableEndDate = apiEvent?.date?.end || event?.date?.end;

          const startDate: Date = parseableStartDate
            ? zonedTimeToUtc(parseISO(parseableStartDate), apiEvent.timezoneUtc)
            : null;
          const endDate: Date = parseableEndDate
            ? zonedTimeToUtc(parseISO(parseableEndDate), apiEvent.timezoneUtc)
            : null;
          const difference = differenceInDays(startDate, now);
          const year: number = startDate ? startDate.getFullYear() : 1997;

          let eventStatus: EventStatus = EventStatus.UPCOMING;
          if (isAfter(now, endDate)) eventStatus = EventStatus.COMPLETED;
          else if (isAfter(now, startDate) && !endDate) eventStatus = EventStatus.LIVE;
          else if (difference <= 7) eventStatus = EventStatus.NEXT;
          else eventStatus = EventStatus.UPCOMING;

          const eventData = {
            contestId: event.externalId,
            gender,
            year,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            eventStatus,
          };

          // seems like there is only ever a single category
          const category: IEventContestCategory = event.categories?.[0];

          if (!category) return null;

          const { rounds = [] } = category;

          // create a unique startList that can be used later for referenceing
          let seedNo: number = 1;
          const eventParticipantsSet = new Set();
          const eventParticipantsList = [];
          // this is used to store a map of the provider id and the custom id
          const athleteProviderIdMapper: {
            [key: string]: string;
          } = {};
          rounds.forEach((round) => {
            round.heats.forEach((heat) => {
              heat.startList.forEach((startListItem) => {
                const customId: string = generateUniqueCode(
                  `${startListItem.athlete.firstName} ${startListItem.athlete.lastName}`,
                );

                athleteProviderIdMapper[startListItem.athlete.externalId] = customId;

                if (!eventParticipantsSet.has(customId)) {
                  eventParticipantsSet.add(customId);
                  eventParticipantsList.push({
                    id: customId,
                    firstName: startListItem.athlete.firstName,
                    lastName: startListItem.athlete.lastName,
                    nationality: startListItem.athlete.nationality,
                    gender: startListItem.athlete.gender === "Man" ? Gender.MALE : Gender.FEMALE,
                    homeTown: startListItem.athlete.homeTown,
                    doB: parse(startListItem.athlete.doB, "dd.MM.yyyy HH:mm:ss", new Date()),
                    stance: startListItem.athlete.stance,
                    fullName: startListItem.athlete.fullName,
                    shortName: startListItem.athlete.shortName,
                    // not taking seed order because it just resets every heat
                    // seedNo: startListItem.order,
                    seedNo: seedNo++,
                  });
                }
              });
            });
          });

          const parsedRounds = rounds.map((round) => {
            const parseableRoundStartDate = round?.date?.start;
            const parseableRoundEndDate = round?.date?.end;

            const roundStartDate: Date = parseableRoundStartDate
              ? zonedTimeToUtc(parseISO(parseableRoundStartDate), apiEvent.timezoneUtc)
              : null;
            const roundEndDate: Date = parseableRoundEndDate
              ? zonedTimeToUtc(parseISO(parseableRoundEndDate), apiEvent.timezoneUtc)
              : null;

            let roundStatus: RoundStatus = RoundStatus.UPCOMING;
            if (roundEndDate && isAfter(now, roundEndDate)) roundStatus = RoundStatus.COMPLETED;
            else if (roundStartDate && !roundEndDate) roundStatus = RoundStatus.LIVE;

            const roundItem = {
              id: round.externalId,
              name: round.name,
              roundNo: round.order,
              roundStatus,
              startDate: roundStartDate?.toISOString(),
              endDate: roundEndDate?.toISOString(),
              lastUpdated: round.updated,
            };

            const parsedHeats = round.heats.map((heat) => {
              let heatStatus: HeatStatus = HeatStatus.UPCOMING;
              if (roundStatus === RoundStatus.LIVE) heatStatus = HeatStatus.LIVE;
              else if (roundStatus === RoundStatus.COMPLETED) heatStatus = HeatStatus.COMPLETED;

              const heatItem = {
                id: heat.externalId, // means nothing because it is always 0
                name: "Heat",
                heatNo: heat.order,
                // applying round start and end to heat because there always seems to be 1 heat in 1 round
                heatStatus,
                startDate: roundStartDate?.toISOString(),
                endDate: roundEndDate?.toISOString(),
                lastUpdated: heat.updated,
              };

              const parsedScores = heat.startList
                .sort((a, b) => a.order - b.order)
                .map((startAthleteRow) => {
                  const customAthleteId: string =
                    athleteProviderIdMapper[startAthleteRow.athlete.externalId];

                  const score = {
                    athleteId: customAthleteId,
                    lineScore1: 0,
                    lineScore2: 0,
                    trickScore1: null,
                    trickScore2: null,
                    trickScore3: null,
                    trickScore4: null,
                    trickScore5: null,
                    trickScore6: null,
                    roundScore: 0,
                    position: 0,
                  };

                  const heatResult = heat.results.find(
                    (resultRow) =>
                      resultRow.externalAthleteId === startAthleteRow.athlete.externalId,
                  );
                  if (heatResult) {
                    let nameKeyIndex = null;
                    let pointKeyIndex = null;
                    // let isPointValidIndex = null;

                    const keysObj = heatResult.details.find(
                      (detailItem) => detailItem.name === "Runs",
                    );

                    // loop through the fields array and find the index where the points are stored
                    // and the index where the name/type is stored, ie, run or trick
                    keysObj.fields.forEach((keyItem, index) => {
                      if (keyItem === "Run") nameKeyIndex = index;
                      if (keyItem === "Points") pointKeyIndex = index;
                      // if (keyItem === "IsValid") isPointValidIndex = index;
                    });
                    if (
                      nameKeyIndex === null ||
                      pointKeyIndex === null
                      // isPointValidIndex === null
                    ) {
                      // no point in proceeding because the keys won't be picked up
                      return null;
                    }

                    if (+heatResult.value) score.roundScore = +heatResult.value;
                    if (+heatResult.rank) score.position = +heatResult.rank;

                    keysObj.details.map((item) => {
                      const payload = item.values;

                      // const isValid = payload[isPointValidIndex] === "True" ? true : false;
                      // const point = isValid ? +payload[pointKeyIndex] : 0;
                      const point = +payload[pointKeyIndex];

                      if (payload[nameKeyIndex] === "Run 1") score.lineScore1 = point;
                      else if (payload[nameKeyIndex] === "Run 2") score.lineScore2 = point;
                      else if (payload[nameKeyIndex] === "Trick 1") score.trickScore1 = point;
                      else if (payload[nameKeyIndex] === "Trick 2") score.trickScore2 = point;
                      else if (payload[nameKeyIndex] === "Trick 3") score.trickScore3 = point;
                      else if (payload[nameKeyIndex] === "Trick 4") score.trickScore4 = point;
                      else if (payload[nameKeyIndex] === "Trick 5") score.trickScore5 = point;
                      else if (payload[nameKeyIndex] === "Trick 6") score.trickScore6 = point;
                    });
                  }

                  return score;
                });

              return {
                ...heatItem,
                scores: parsedScores,
              };
            });

            return {
              ...roundItem,
              heats: parsedHeats,
            };
          });

          // mapping this from a 1 heat per round to a 1 round and multiple heats
          // since that is easier for the sim

          const finalRoundNames = ["final", "finals"];
          const finalRound = parsedRounds.find((round) =>
            finalRoundNames.includes(round.name.toLowerCase()),
          );
          const qualifyingRounds = parsedRounds
            .filter((round) => !finalRoundNames.includes(round.name.toLowerCase()))
            .sort((roundA, roundB) => roundA.roundNo - roundB.roundNo);

          // setting final round no to 2 because it breaks the sim if its something not like that
          if (finalRound) finalRound.roundNo = 2;

          // take the first round as the main qualifying round
          const qualifyingRound = qualifyingRounds?.[0];
          const lastQualifyingRound = qualifyingRounds[qualifyingRounds.length - 1];
          if (qualifyingRound) {
            qualifyingRound.name = "Knock-Out Round";
            let heatCount: number = 1;
            const { heats = [] } = qualifyingRound;
            // setting the first heat in qualifying round as a hardcoded value
            const qualifyingRoundHeats = heats.map((row) => ({
              ...row,
              heatNo: heatCount++,
              id: `round_${qualifyingRound.id}_1`,
            }));

            // end date should be the end date of round 4
            if (lastQualifyingRound && lastQualifyingRound.id !== qualifyingRound.id)
              qualifyingRound.endDate = lastQualifyingRound.endDate;

            qualifyingRound.heats = qualifyingRoundHeats;

            qualifyingRounds
              .filter((round) => round.id !== qualifyingRound.id)
              .forEach((round) => {
                const roundHeats = round.heats.map((row) => ({
                  ...row,
                  heatNo: heatCount++,
                  id: `round_${round.id}_1`,
                }));

                qualifyingRound.heats.push(...roundHeats);
              });
          }

          return {
            ...eventData,
            participants: eventParticipantsList,
            // for womens there will only be a finals round
            rounds: qualifyingRound ? [qualifyingRound, finalRound] : [finalRound],
          };
        })
        .filter((row) => row !== null);

      return parsedEvents;
    } catch (error) {
      throw error;
    }
  }
}
