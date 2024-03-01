import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { format, parse, startOfDay, endOfDay } from "date-fns";
import { v4 } from "uuid";
// import axios from "axios";

import SportsResponse from "./schemas/responses/sports.response";
import SportsFuturesResponse from "./schemas/responses/sportsFutures.response";

import SportsService from "./sports.service";

import { SportsTypes, EventStatus, Gender } from "../../../constants/system";

import ApiGuard from "../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("Sports")
@Controller({
  path: "client/sports",
})
export default class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @ApiResponse({
    description: "Success",
    type: SportsFuturesResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    description: "Returns a list of sports along with the tours and futures.",
  })
  @Get("/futures")
  @UseInterceptors(CacheInterceptor)
  async fetchSportsFutures(): Promise<SportsFuturesResponse[]> {
    const { wsl, sls, nrx, spr, masl, fdrift, motocrs, f1, motogp, mxgp, jaialai } =
      await this.sportsService.fetchSportsFutures();

    // creating fake ids for each sport
    const WSL = {
      id: SportsTypes.SURFING,
      name: "World Surf League",
      sportType: SportsTypes.SURFING,
    };
    const SLS = {
      id: SportsTypes.SKATEBOARDING,
      name: "Skateboarding League",
      sportType: SportsTypes.SKATEBOARDING,
    };
    const NRX = {
      id: SportsTypes.RALLYCROSS,
      name: "Nitrocross",
      sportType: SportsTypes.RALLYCROSS,
    };
    const SPR = {
      id: SportsTypes.SUPERCROSS,
      name: "Supercross",
      sportType: SportsTypes.SUPERCROSS,
    };
    const MASL = {
      id: SportsTypes.MASL,
      name: "Major Arena Soccer League",
      sportType: SportsTypes.MASL,
    };
    const FDRIFT = {
      id: SportsTypes.FDRIFT,
      name: "Formula Drift",
      sportType: SportsTypes.FDRIFT,
    };
    const MTCROSS = {
      id: SportsTypes.MOTOCROSS,
      name: "Motocross",
      sportType: SportsTypes.MOTOCROSS,
    };
    const F1 = {
      id: SportsTypes.F1,
      name: "Formula One",
      sportType: SportsTypes.F1,
    };
    const MG = {
      id: SportsTypes.MotoGP,
      name: "MotoGP",
      sportType: SportsTypes.MotoGP,
    };
    const MXGP = {
      id: SportsTypes.MXGP,
      name: "Motocross World Championship",
      sportType: SportsTypes.MXGP,
    };
    const JA = {
      id: SportsTypes.JA,
      name: "Jai Alai",
      sportType: SportsTypes.JA,
    };

    const payload: SportsFuturesResponse[] = [];

    payload.push(
      {
        ...WSL,
        tours: wsl.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...SLS,
        tours: sls.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...NRX,
        tours: nrx.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...SPR,
        tours: spr.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...MASL,
        tours: masl.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...FDRIFT,
        tours: fdrift.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...MTCROSS,
        tours: motocrs.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...F1,
        tours: f1.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...MG,
        tours: motogp.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...MXGP,
        tours: mxgp.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
      {
        ...JA,
        tours: jaialai.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              name: `${year.year} Season`,
              // if one market is open then open can be displayed
              isOpen: year.futures.some((future) => future.isMarketOpen),
              futureStatus: year?.futures[0]?.status,
              // futures: year.futures.map((future) => ({
              //   id: future.id,
              //   isMarketOpen: future.isMarketOpen,
              //   type: future.type,
              // })),
            }))
            .sort((a, b) => b.year - a.year),
        })),
      },
    );

    return payload;
  }

  @ApiResponse({
    description: "Success",
    type: SportsResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    description: "Returns a list of sports along with the tours and events.",
  })
  @Get()
  @UseInterceptors(CacheInterceptor)
  async fetchSports(): Promise<SportsResponse[]> {
    const { wsl, sls, nrx, spr, masl, fdrift, motocrs, f1, motogp, mxgp, jaialai } =
      await this.sportsService.fetchSports();

    // for BKFC and PBR make the axios call to fetch the filename
    // const [pbrResponse, bkfcResponse] = await Promise.all([
    //   axios
    //     .get("https://qf04m2x0n7.execute-api.us-west-1.amazonaws.com/live/api/pbr/odds")
    //     .then((response) => response.data?.data),
    //   axios
    //     .get("https://qf04m2x0n7.execute-api.us-west-1.amazonaws.com/live/api/bkfc/odds")
    //     .then((response) => response.data?.data),
    // ]);

    // creating fake ids for each sport
    const WSL = {
      id: SportsTypes.SURFING,
      name: "World Surf League",
      sportType: SportsTypes.SURFING,
    };
    const SLS = {
      id: SportsTypes.SKATEBOARDING,
      name: "Skateboarding League",
      sportType: SportsTypes.SKATEBOARDING,
    };
    const NRX = {
      id: SportsTypes.RALLYCROSS,
      name: "Nitrocross",
      sportType: SportsTypes.RALLYCROSS,
    };
    const SPR = {
      id: SportsTypes.SUPERCROSS,
      name: "Supercross",
      sportType: SportsTypes.SUPERCROSS,
    };
    const MASL = {
      id: SportsTypes.MASL,
      name: "Major Arena Soccer League",
      sportType: SportsTypes.MASL,
    };
    const FDRIFT = {
      id: SportsTypes.FDRIFT,
      name: "Formula Drift",
      sportType: SportsTypes.FDRIFT,
    };
    const MTCROSS = {
      id: SportsTypes.MOTOCROSS,
      name: "Motocross",
      sportType: SportsTypes.MOTOCROSS,
    };
    const F1 = {
      id: SportsTypes.F1,
      name: "Formula One",
      sportType: SportsTypes.F1,
    };
    const MG = {
      id: SportsTypes.MotoGP,
      name: "MotoGP",
      sportType: SportsTypes.MotoGP,
    };
    const MXGP = {
      id: SportsTypes.MXGP,
      name: "Motocross World Championship",
      sportType: SportsTypes.MXGP,
    };
    const JA = {
      id: SportsTypes.JA,
      name: "Jai Alai",
      sportType: SportsTypes.JA,
    };
    // const BKFC = {
    //   id: SportsTypes.BKFC,
    //   name: "Bare Knuckle Fighting Championship",
    //   sportType: SportsTypes.BKFC,
    // };
    // const PBR = {
    //   id: SportsTypes.PBR,
    //   name: "Professional Bull Racing",
    //   sportType: SportsTypes.PBR,
    // };

    // masl formatting
    const maslTourGroupObj: {
      [tourName: string]: {
        id: string;
        name: string;
        gender: string;
        years: {
          [year: number]: {
            id: string;
            year: number;
            events: {
              id: string;
              name: string;
              eventStatus: EventStatus;
              startDate: Date;
              endDate: Date;
            }[];
          };
        };
      };
    } = {};

    masl.forEach((row) => {
      if (!maslTourGroupObj[row.tourName])
        maslTourGroupObj[row.tourName] = {
          id: v4(),
          name: row.tourName,
          gender: Gender.MALE,
          years: {},
        };

      if (!maslTourGroupObj[row.tourName].years[row.year])
        maslTourGroupObj[row.tourName].years[row.year] = {
          id: v4(),
          year: row.year,
          events: [],
        };

      const parsedDate: Date = parse(row.date, "MM-dd-yyyy", new Date());
      maslTourGroupObj[row.tourName].years[row.year].events.push({
        id: row.date,
        name: row.eventName,
        eventStatus: row.eventStatus,
        startDate: startOfDay(parsedDate),
        endDate: endOfDay(parsedDate),
      });
    });

    const payload: SportsResponse[] = [];

    payload.push(
      {
        ...WSL,
        tours: wsl.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...SLS,
        leagues: sls.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        tours: [],
      },
      {
        ...NRX,
        tours: nrx.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...SPR,
        tours: spr.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...MASL,
        tours: [],
        leagues: [],
      },
      /* {
        ...MASL,
        tours: Object.values(maslTourGroupObj).map((row) => ({
          id: row.id,
          gender: row.gender,
          name: row.name,
          years: Object.values(row.years)
            .map((rowYear) => ({
              id: rowYear.id,
              year: rowYear.year,
              events: rowYear.events
                .map((rowYearEvent) => ({
                  id: rowYearEvent.id,
                  name: rowYearEvent.name,
                  eventStatus: rowYearEvent.eventStatus,
                  startDate: rowYearEvent.startDate,
                  endDate: rowYearEvent.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      }, */
      {
        ...FDRIFT,
        tours: fdrift.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...MTCROSS,
        tours: motocrs.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...F1,
        tours: f1.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...MG,
        tours: motogp.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...MXGP,
        tours: mxgp.map((tour) => ({
          id: tour.id,
          name: tour.name,
          gender: tour.gender,
          years: tour.years
            .map((year) => ({
              id: year.id,
              year: year.year,
              events: year.events
                .map((event) => ({
                  id: event.id,
                  name: event.name,
                  eventStatus: event.eventStatus,
                  startDate: event.startDate,
                  endDate: event.endDate,
                }))
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            }))
            .sort((a, b) => b.year - a.year),
        })),
        leagues: [],
      },
      {
        ...JA,
        tours: jaialai.map((tour) => {
          return {
            id: tour.id,
            name: tour.name,
            gender: tour.gender,
            years: tour.years.map((year) => {
              const eventsByDate = {};

              year.events.forEach((event) => {
                //date conversion
                const inputDateString = event.startDate;

                const inputDate = new Date(inputDateString);
                const day = String(inputDate.getUTCDate()).padStart(2, "0");
                const month = String(inputDate.getUTCMonth() + 1).padStart(2, "0");
                const yearDate = inputDate.getUTCFullYear();

                const formattedDate = `${month}-${day}-${yearDate}`;

                //converting months in words
                const date = new Date(`${inputDateString}`);
                const formattedMonthName = format(date, "MMMM d");

                const eventDate = formattedDate;

                if (!eventsByDate[eventDate]) {
                  eventsByDate[eventDate] = {
                    id: formattedDate,
                    name: formattedMonthName,
                    matches: [],
                  };
                }

                const homeTeamRow = event.teams.find((teamRow) => teamRow.isHomeTeam);
                const awayTeamRow = event.teams.find((teamRow) => !teamRow.isHomeTeam);
                const hasMatch: boolean = eventsByDate[eventDate]?.matches?.some(
                  (row) => row.homeTeam === homeTeamRow?.team?.name,
                );

                if (!hasMatch)
                  eventsByDate[eventDate].matches.push({
                    id: event?.id,
                    homeTeam: homeTeamRow.team?.name,
                    awayTeam: awayTeamRow.team?.name,
                    startDate: event?.startDate,
                    endDate: event?.endDate,
                    eventStatus: event?.eventStatus,
                  });
              });
              const processedEvents = Object.keys(eventsByDate).map((date) => eventsByDate[date]);
              return {
                id: year.id,
                year: year.year,
                events: processedEvents,
              };
            }),
          };
        }),
        leagues: [],
      },
      // {
      //   ...BKFC,
      //   tours: [
      //     {
      //       id: v4(),
      //       name: "Bare Knuckle Fighting Championship",
      //       gender: Gender.MALE,
      //       years: [
      //         {
      //           id: v4(),
      //           year: 2024,
      //           events: [
      //             {
      //               id: v4(),
      //               name: bkfcResponse?.name || "BKFC",
      //               eventStatus: EventStatus.UPCOMING,
      //               startDate: new Date(),
      //               endDate: null,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      //   leagues: [],
      // },
      // {
      //   ...PBR,
      //   tours: [
      //     {
      //       id: v4(),
      //       name: "Professional Bull Racing",
      //       gender: Gender.MALE,
      //       years: [
      //         {
      //           id: v4(),
      //           year: 2024,
      //           events: [
      //             {
      //               id: v4(),
      //               name: pbrResponse?.name || "PBR",
      //               eventStatus: EventStatus.UPCOMING,
      //               startDate: new Date(),
      //               endDate: null,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      //   leagues: [],
      // },
    );

    return payload;
  }
}
