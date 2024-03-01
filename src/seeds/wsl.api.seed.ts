import { Knex } from "knex";
import axios from "axios";

import config from "./config";
import { SportsDbSchema } from "../constants/system";

import IAuthTicket from "../interfaces/wsl/authTicket";
import ITourEvents from "../interfaces/wsl/toursEvents";
import IYearEvent from "../interfaces/wsl/yearEvents";
import IEventResponse, { Event } from "../interfaces/wsl/event";

const baseUrl = "https://api.worldsurfleague.com/v1";

const MENS_TOUR_ID = "1";
const WOMENS_TOUR_ID = "2";

const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 50_000,
  params: {
    appKey: config.wslClientId,
  },
});

/**
 * This seed is used to map api ids to the database ids
 */
export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  const token: string = await getToken();

  await knex.transaction(async (trx) => {
    try {
      // fetch all events from the database
      const events: any[] = await knex("events")
        .withSchema(SportsDbSchema.WSL)
        .transacting(trx)
        .select([
          "events.id as id",
          "events.name as name",
          "tours.id as tourId",
          // "tours.gender as gender",
          "tourYears.year as year",
          knex.raw(`CASE WHEN gender = 'women' then 'F' else 'M' end as gender`),
        ])
        .leftJoin("tourYears", "events.tourYearId", "tourYears.id")
        .leftJoin("tours", "tourYears.tourId", "tours.id");

      const tourEventList: ITourEvents = await fetchEventsByYear(new Date().getFullYear(), token);

      const { mens = [], womens = [] } = tourEventList;

      const mensApiEvents: IEventResponse[] = await Promise.all(
        mens.map((row) => fetchEventDetails(row.eventId, token)),
      );
      const womensApiEvents: IEventResponse[] = await Promise.all(
        womens.map((row) => fetchEventDetails(row.eventId, token)),
      );

      const mensMapping = fetchMatchedEvents(mensApiEvents, events);
      const womensMapping = fetchMatchedEvents(womensApiEvents, events);

      const eventsMapping = [...mensMapping, ...womensMapping];

      await Promise.all(
        eventsMapping.map((row) =>
          knex("events")
            .transacting(trx)
            .withSchema(SportsDbSchema.WSL)
            .where("id", row.dbEventId)
            .update({
              providerId: row.providerId,
            }),
        ),
      );

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

const fetchMatchedEvents = (
  apiEvents: IEventResponse[],
  dbEvents: any[],
): {
  providerId: string;
  dbEventId: string;
}[] => {
  const genderApiEvents: Event[] = [];
  apiEvents.forEach((row) => {
    Object.values(row.events)
      .filter((itemRow) => itemRow.tourId === MENS_TOUR_ID)
      .forEach((itemRow) => {
        genderApiEvents.push(itemRow);
      });
  });

  const dbMap: {
    providerId: string;
    dbEventId: string;
  }[] = [];
  dbEvents.forEach((row) => {
    const apiMatchedEvent = genderApiEvents.find(
      (item) => item.name === row.name && item.year === row.year,
    );
    if (apiMatchedEvent)
      dbMap.push({
        providerId: apiMatchedEvent.eventId,
        dbEventId: row.id,
      });
  });

  return dbMap;
};

const getToken = async (): Promise<string> => {
  try {
    const clientId = config.wslClientId;
    const clientSecret = config.wslClientSecret;

    const {
      data: { access_token },
    } = await apiInstance.post<IAuthTicket>(
      `/oauth/token`,
      {
        grant_type: "client_credentials",
      },
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
        },
      },
    );

    return access_token;
  } catch (error) {
    throw error;
  }
};

const fetchEventsByYear = async (year: number, token: string): Promise<ITourEvents> => {
  try {
    const { data } = await apiInstance.get<IYearEvent>("/site/eventsinyear", {
      params: {
        year,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const {
      site: { eventsInYear },
    } = data;

    const { months } = eventsInYear[year];

    const resultTours: ITourEvents = {
      mens: [],
      womens: [],
    };

    Object.keys(months).forEach((key) => {
      const row = months[key];
      const { tours } = row;

      Object.keys(tours)
        .filter((toursKey) => [MENS_TOUR_ID, WOMENS_TOUR_ID].includes(toursKey))
        .forEach((toursKey) => {
          const { events = [] } = tours[toursKey];

          if (toursKey === MENS_TOUR_ID)
            resultTours.mens.push(
              ...events.map((itemRow) => ({
                month: +key,
                eventId: itemRow.eventId,
              })),
            );
          else if (toursKey === WOMENS_TOUR_ID)
            resultTours.womens.push(
              ...events.map((itemRow) => ({
                month: +key,
                eventId: itemRow.eventId,
              })),
            );
        });
    });

    return resultTours;
  } catch (error) {
    throw error;
  }
};

const fetchEventDetails = async (
  externalEventId: string,
  token: string,
): Promise<IEventResponse> => {
  try {
    const { data } = await apiInstance.get<IEventResponse>("/event/details", {
      params: {
        eventId: externalEventId,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
