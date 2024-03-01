import { INRXRoundConfig, IResultCategory } from "../interfaces/nrx";

import { PublicOddTypes } from "./odds";

export enum Environment {
  Local = "local",
  Develop = "dev",
  Staging = "staging",
  Release = "release",
}

export enum NodeEnvironment {
  Development = "development",
  Production = "production",
}

export const DEFAULT_HOLD_PERCENTAGE = 100;
export const SHOWS_HOLD_PERCENTAGE = 200;
export const PODIUM_HOLD_PERCENTAGE = 300;

export const MIN_PROBABILITY = 0;
export const MAX_PROBABILITY = 99.5;

export enum AthleteStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  INJURED = 3,
  BANNED = 4,
  DISQUALIFIED = 5,
  SUSPENDED = 6,
  PARENTAL_LEAVE = 7,
  REPLACEMENT = 8,
}

export enum EventStatus {
  UPCOMING = 2,
  LIVE = 1,
  COMPLETED = 3,
  CANCELLED = 4,
  POSTPONED = 5,
  NEXT = 6,
  IN_WINDOW = 7,
}

export enum HeatStatus {
  UPCOMING = 2,
  LIVE = 1,
  COMPLETED = 3,
  CANCELLED = 4,
  POSTPONED = 5,
  NEXT = 6,
  IN_WINDOW = 7,
}

export enum RoundStatus {
  UPCOMING = 2,
  LIVE = 1,
  COMPLETED = 3,
  CANCELLED = 4,
  POSTPONED = 5,
  NEXT = 6,
  IN_WINDOW = 7,
}

export enum FutureStatus {
  UPCOMING = 2,
  LIVE = 1,
  COMPLETED = 3,
  CANCELLED = 4,
  POSTPONED = 5,
  NEXT = 6,
  IN_WINDOW = 7,
}

// doing it this way because the config service does not work with a decorator where this domain is used
export const apiDomain = process.env.API_HOST;

export const DEFAULT_COUNTRY = "US";

export enum UserTypes {
  ADMIN = 1,
  TRADER = 2,
}

export enum AuthUserType {
  ADMIN = "admin",
  CLIENT = "client",
  PUBLICL = "public",
}

export enum Queues {
  SIM_TASKS = "sim_tasks",
  DEAD_SIM_TASKS = "dead_sim_tasks",
  SIM_TASK_RESPONSES = "sim_task_responses",
  DEAD_SIM_TASK_RESPONSES = "dead_sim_task_responses",
  TASKS = "tasks",
  DEAD_TASKS = "dead_tasks",
  CRON = "cron",
  DEAD_CRON = "dead_cron",
}

export enum QueueMessageType {
  EVENT = "event",
  MARKET_NOTIFICATION = "market_notification",
  SIM = "sim",
  SIM_RESPONSE = "sim_response",
  CRON = "cron",
}

export enum QueueCronType {
  MASL_SYNC_SCHEDULED_EVENTS = "masl_sync_scheduled_events",
  MASL_SYNC_LIVE_EVENTS = "masl_sync_live_events",

  WSL_SYNC_SCHEDULED_EVENTS = "wsl_sync_scheduled_events",
  WSL_SYNC_LIVE_EVENTS = "wsl_sync_live_events",

  SLS_SYNC_SCHEDULED_EVENTS = "sls_sync_scheduled_events",
  SLS_SYNC_LIVE_EVENTS = "sls_sync_live_events",
}

export enum SportsDbSchema {
  WSL = "wsl",
  SLS = "sls",
  NRX = "nrx",
  SPR = "spr",
  MASL = "masl",
  PBR = "pbr",
  BKFC = "bkfc",
  F1 = "f1",
  MotoGP = "motogp",
  MOTOCRS = "motocrs",
  FDRIFT = "fdrift",
  MXGP = "mxgp",
  JA = "jaialai",
}

export enum SportsTypes {
  SURFING = "wsl",
  SKATEBOARDING = "sls",
  RALLYCROSS = "nrx",
  SUPERCROSS = "spr",
  MASL = "masl",
  PBR = "pbr",
  BKFC = "bkfc",
  F1 = "f1",
  MotoGP = "motogp",
  MOTOCROSS = "motocrs",
  FDRIFT = "fdrift",
  MXGP = "mxgp",
  JA = "jaialai",
}

export enum SportNames {
  wsl = "World Surfing League",
  sls = "Street League Skateboarding",
  nrx = "Nitrocross",
  spr = "Supercross",
  masl = "Major Arena Soccer League",
  pbr = "Professional Bull Racing",
  f1 = "Formula 1",
  motogp = "MotoGP",
  motocrs = "Motocross",
  fdrift = "Formula Drift",
  mxgp = "MXGP",
  jaialai = "Jai Alai",
}

export enum SimRunTypes {
  EVENT = 1,
  HEAT = 1,
}
export enum Gender {
  MALE = "men",
  FEMALE = "women",
}

export enum NRXRounds {
  TP = 1, // Timed Practice
  QA = 2, // Qualifier
  BR = 3, // Battle Round
  // BF = 4, // Battle Final
  // PR = 5, // Prelims
  HEAT_ROUND = 4, // Heat
  SEMI_FINALS = 5, // Semifinals
  LCQ = 6, // Last Change Qualifier
  FINALS = 7, // Final
}
// export enum NRXRounds {
//   // FP1 = 0,
//   TP = 1,
//   BQ = 2,
//   BR1 = 3,
//   BR2 = 4,
//   BR3 = 5,
//   BR4 = 6,
//   HEAT_ROUND_1 = 7,
//   SEMIFINALS = 8,
//   LCQ = 9,
//   FINALS = 10,
// }

export enum NRXEventCategoryType {
  GROUP_E = "GROUP E",
  CROSSCAR = "CROSSCAR",
  SUPERCAR = "SUPERCAR",
  SXS = "SxS",
  SXSCANADA = "SxS Canada",
  NEXT = "Next",
  RALLY2WD = "RALLY 2WD",
  RALLY4WD = "RALLY 4WD",
  BAJABUGGY = "Baja Buggy",
  VANPRIX = "Van Prix",
}

export enum FDRIFTEventCategoryType {
  SUPERCAR = "SUPERCAR",
}

export const NRXResultsCategoryType: IResultCategory = {
  [NRXEventCategoryType.GROUP_E]: {
    name: "GroupE",
    eventCategory: NRXEventCategoryType.GROUP_E,
  },
  [NRXEventCategoryType.SUPERCAR]: {
    name: "SC",
    eventCategory: NRXEventCategoryType.SUPERCAR,
  },
  [NRXEventCategoryType.NEXT]: {
    name: "NRX NEXT",
    eventCategory: NRXEventCategoryType.NEXT,
  },
};

export const NRXScheduleCategoryType: IResultCategory = {
  [NRXEventCategoryType.GROUP_E]: {
    name: "Group E",
    eventCategory: NRXEventCategoryType.GROUP_E,
  },
  [NRXEventCategoryType.SUPERCAR]: {
    name: "SC",
    eventCategory: NRXEventCategoryType.SUPERCAR,
  },
  [NRXEventCategoryType.NEXT]: {
    name: "NEXT",
    eventCategory: NRXEventCategoryType.NEXT,
  },
};

export enum NRXEventStatus {
  SCHEDULED = "Scheduled",
  FINISHED = "Finished",
  IN_PROGRESS = "In progress",
  CANCELLED = "Canceled",
}

export enum NRXLapStatus {
  ACTIVE = "ACT",
  DNF = "DNF",
  DNS = "DNS",
  BYE = "BYE",
  DSQ = "DSQ",
}

export enum FDRIFTLapStatus {
  ACTIVE = "ACT",
  DNF = "DNF",
  DNS = "DNS",
  BYE = "BYE",
  DSQ = "DSQ",
}

export enum NRXLapMetadata {
  BYE = "BYE",
  WINNER = "WINNER",
  DNS = "DNS",
  DNF = "DNF",
  DSQ = "DSQ",
}

export enum FutureMarkets {
  WINNER = "winner",
  TOP_2 = "top2",
  TOP_3 = "top3",
  TOP_5 = "top5",
  TOP_10 = "top10",
  MAKE_CUT = "makeCut",
  MAKE_PLAYOFFS = "makePlayOdds",
}

export enum OddMarkets {
  EVENT_WINNER_PROJECTIONS = "eventWinnerProjections",
  EVENT_SECOND_PLACE_PROJECTIONS = "eventSecondPlaceProjections",
  HEAT_PROJECTIONS = "heatProjections",
  PROP_BET_PROJECTIONS = "propBetProjections",
  HEAD_TO_HEAD_PROJECTIONS = "headToHeadProjections",
  PODIUM_PROJECTIONS = "podiumProjections",
  SHOWS_PROJECTIONS = "showsProjections",
  DREAM_TEAM = "dreamTeamProjections",
  EXACTAS = "exactasEventProjections",
  HEAT_EXACTAS = "exactasHeatProjections",
  FUTURES_WINNER = "futures_winner",
  FUTURES_TOP_2 = "futures_top2",
  FUTURES_TOP_3 = "futures_top3",
  FUTURES_TOP_5 = "futures_top5",
  FUTURES_TOP_10 = "futures_top10",
  FUTURES_MAKE_CUT = "futures_makeCut",
  FUTURES_MAKE_PLAYOFFS = "futures_makePlayOdds",
}

export enum ExactasType {
  EXACTAS = 2,
  TRIFECTAS = 3,
  SUPERFECTAS = 4,
}

export enum FrontendOddPageParams {
  EVENT_WINNER = "eventWinner",
  SECOND_PLACE = "secondPlace",
  HEAT_WINNER = "heatWinner",
  HEAD_TO_HEAD = "headToHead",
  PROP_BETS = "propBets",
  SHOWS = "showOdds",
  PODIUMS = "podiumOdds",
  DREAM_TEAM = "dreamTeam",
  EXACTAS = "exactasEventProjections",
  HEAT_EXACTAS = "exactasHeatProjections",
  FUTURES_WINNER = "futures_winner",
  FUTURES_TOP_2 = "futures_top2",
  FUTURES_TOP_3 = "futures_top3",
  FUTURES_TOP_5 = "futures_top5",
  FUTURES_TOP_10 = "futures_top10",
  FUTURES_MAKE_CUT = "futures_makeCut",
  FUTURES_MAKE_PLAYOFFS = "futures_makePlayOdds",
}

export const nrxRoundConfig: INRXRoundConfig = {
  [NRXRounds.TP]: {
    name: "Timed Practice",
    heats: 1,
  },
  [NRXRounds.QA]: {
    name: "Qualifier",
    heats: 1,
  },
  [NRXRounds.BR]: {
    name: "Battle Round",
    heats: 1,
  },
  // [NRXRounds.BF]: {
  //   name: "Battle Finals",
  //   heats: 1,
  // },
  // [NRXRounds.PR]: {
  //   name: "Prelims",
  //   heats: 3,
  // },
  [NRXRounds.HEAT_ROUND]: {
    name: "Heat",
    heats: 1,
  },
  [NRXRounds.SEMI_FINALS]: {
    name: "Semifinals",
    heats: 1,
  },
  [NRXRounds.LCQ]: {
    name: "Last Chance Qualifier",
    heats: 1,
  },
  [NRXRounds.FINALS]: {
    name: "Final",
    heats: 1,
  },
};
// export const nrxRoundConfig: INRXRoundConfig = {
//   // the value here is the number of heats per round
//   /* [NRXRounds.FP1]: {
//     name: "Free Practice 1",
//     heats: 1,
//   }, */
//   [NRXRounds.TP]: {
//     name: "Timed Practice",
//     heats: 1,
//   },
//   [NRXRounds.BQ]: {
//     name: "Battle Qualifying",
//     heats: 2,
//   },
//   [NRXRounds.BR1]: {
//     name: "Battle Round 1",
//     heats: 8,
//   },
//   [NRXRounds.BR2]: {
//     name: "Battle Round 2",
//     heats: 4,
//   },
//   [NRXRounds.BR3]: {
//     name: "Battle Round 3",
//     heats: 2,
//   },
//   [NRXRounds.BR4]: {
//     name: "Battle Round 4",
//     heats: 1,
//   },
//   [NRXRounds.HEAT_ROUND_1]: {
//     name: "Round 1",
//     // heats: 3,
//     heats: 2,
//   },
//   [NRXRounds.SEMIFINALS]: {
//     name: "Semifinal",
//     heats: 2,
//   },
//   [NRXRounds.LCQ]: {
//     name: "Last Chance Qualifier",
//     heats: 1,
//   },
//   [NRXRounds.FINALS]: {
//     name: "Final",
//     heats: 1,
//   },
// };

export const thrillOneRoundMap = (categoryName: NRXEventCategoryType, isSchedule: boolean) => ({
  [NRXRounds.TP]: {
    round: NRXRounds.TP,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_TS_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Timed Seeding Group 1`,
        resultName: [],
        heatNo: 1,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Timed Seeding Group 2`,
        resultName: [],
        heatNo: 2,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Timed Seeding Group 3`,
        resultName: [],
        heatNo: 3,
      },
    ],
  },
  [NRXRounds.QA]: {
    round: NRXRounds.QA,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_Q_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Official Qualifying Qualifier 1`,
        resultName: [],
        heatNo: 1,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Official Qualifying Qualifier 2`,
        resultName: [],
        heatNo: 2,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Official Qualifying Qualifier 3`,
        resultName: [],
        heatNo: 3,
      },
      // {
      //   name: `${
      //     isSchedule
      //       ? NRXScheduleCategoryType[categoryName].name
      //       : NRXResultsCategoryType[categoryName].name
      //   } Free Qualifier Qualifier Group1`,
      //   resultName: [],
      //   heatNo: 4,
      // },
    ],
  },
  [NRXRounds.BR]: {
    round: NRXRounds.BR,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_TQ_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Top Qualifier Top Qualifier`,
        resultName: [],
        heatNo: 1,
      },
      // {
      //   name: `${
      //     isSchedule
      //       ? NRXScheduleCategoryType[categoryName].name
      //       : NRXResultsCategoryType[categoryName].name
      //   } Battle Round Battle Group 2`,
      //   resultName: [],
      //   heatNo: 3,
      // },
      // {
      //   name: `${
      //     isSchedule
      //       ? NRXScheduleCategoryType[categoryName].name
      //       : NRXResultsCategoryType[categoryName].name
      //   } Battle Round Battle Group 3`,
      //   resultName: [],
      //   heatNo: 3,
      // },
    ],
  },
  // [NRXRounds.BF]: {
  //   round: NRXRounds.BF,
  //   roundResultNames: [
  //     `${
  //       isSchedule
  //         ? NRXScheduleCategoryType[categoryName].name
  //         : NRXResultsCategoryType[categoryName].name
  //     }_BF_results`,
  //   ],
  //   heats: [
  //     {
  //       name: `${
  //         isSchedule
  //           ? NRXScheduleCategoryType[categoryName].name
  //           : NRXResultsCategoryType[categoryName].name
  //       } Battle Final Battle Final`,
  //       resultName: [],
  //       heatNo: 1,
  //     },
  //   ],
  // },
  // [NRXRounds.PR]: {
  //   round: NRXRounds.PR,
  //   roundResultNames: [
  //     `${
  //       isSchedule
  //         ? NRXScheduleCategoryType[categoryName].name
  //         : NRXResultsCategoryType[categoryName].name
  //     }_Prelims_results`,
  //   ],
  //   heats: [
  //     {
  //       name: `${
  //         isSchedule
  //           ? NRXScheduleCategoryType[categoryName].name
  //           : NRXResultsCategoryType[categoryName].name
  //       } Prelims Group1`,
  //       resultName: [],
  //       heatNo: 1,
  //     },
  //     {
  //       name: `${
  //         isSchedule
  //           ? NRXScheduleCategoryType[categoryName].name
  //           : NRXResultsCategoryType[categoryName].name
  //       } Prelims Group2`,
  //       resultName: [],
  //       heatNo: 2,
  //     },
  //     {
  //       name: `${
  //         isSchedule
  //           ? NRXScheduleCategoryType[categoryName].name
  //           : NRXResultsCategoryType[categoryName].name
  //       } Prelims Group3`,
  //       resultName: [],
  //       heatNo: 3,
  //     },
  //     {
  //       name: `${
  //         isSchedule
  //           ? NRXScheduleCategoryType[categoryName].name
  //           : NRXResultsCategoryType[categoryName].name
  //       } Prelims Group4`,
  //       resultName: [],
  //       heatNo: 4,
  //     },
  //   ],
  // },
  [NRXRounds.HEAT_ROUND]: {
    round: NRXRounds.HEAT_ROUND,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_Heat_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Heat Session Heat 1`,
        resultName: [],
        heatNo: 1,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Heat Session Heat 2`,
        resultName: [],
        heatNo: 2,
      },
      // {
      //   name: `${
      //     isSchedule
      //       ? NRXScheduleCategoryType[categoryName].name
      //       : NRXResultsCategoryType[categoryName].name
      //   } Heat Group3`,
      //   resultName: [],
      //   heatNo: 3,
      // },
    ],
  },
  [NRXRounds.SEMI_FINALS]: {
    round: NRXRounds.SEMI_FINALS,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_SF_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Semi Final Semi Final 1`,
        resultName: [],
        heatNo: 1,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Semi Final Semi Final 2`,
        resultName: [],
        heatNo: 2,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Semi Final Semi Final 2`,
        resultName: [],
        heatNo: 3,
      },
    ],
  },
  [NRXRounds.LCQ]: {
    round: NRXRounds.LCQ,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_LCQ_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Last Chance Qualifier LCQ 1`,
        resultName: [],
        heatNo: 1,
      },
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Last Chance Qualifier LCQ 2`,
        resultName: [],
        heatNo: 2,
      },
    ],
  },
  [NRXRounds.FINALS]: {
    round: NRXRounds.FINALS,
    roundResultNames: [
      `${
        isSchedule
          ? NRXScheduleCategoryType[categoryName].name
          : NRXResultsCategoryType[categoryName].name
      }_FI_results`,
    ],
    heats: [
      {
        name: `${
          isSchedule
            ? NRXScheduleCategoryType[categoryName].name
            : NRXResultsCategoryType[categoryName].name
        } Final Final`,
        resultName: [],
        heatNo: 1,
      },
    ],
  },
});
// export const thrillOneRoundMap = (categoryName: NRXEventCategoryType, isSchedule: boolean) => ({
//   /* [NRXRounds.FP1]: {
//     round: NRXRounds.FP1,
//     heats: [
//       {
//         name: `${categoryName} Free Practice 1 FP1`,
//         heatNo: 1,
//       },
//     ],
//   }, */
//   [NRXRounds.TP]: {
//     round: NRXRounds.TP,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Timed Practice TP`,
//         resultName: ["TPresults"],
//         heatNo: 1,
//       },
//     ],
//   },
//   [NRXRounds.BQ]: {
//     round: NRXRounds.BQ,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Seeding Heat 1 Battle ${
//           categoryName === NRXEventCategoryType.GROUP_E ? "Seeding Heat 1" : "Qualifier 1"
//         }`,
//         resultName: ["BH1"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Seeding Heat 2 Battle Seeding Heat 2`,
//         resultName: ["BH2"],
//         heatNo: 2,
//       },
//     ],
//   },
//   [NRXRounds.BR1]: {
//     round: NRXRounds.BR1,
//     roundResultNames: ["Round_1"],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B1`,
//         resultName: ["bracket"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B2`,
//         resultName: ["bracket"],
//         heatNo: 2,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B3`,
//         resultName: ["bracket"],
//         heatNo: 3,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B4`,
//         resultName: ["bracket"],
//         heatNo: 4,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B5`,
//         resultName: ["bracket"],
//         heatNo: 5,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B6`,
//         resultName: ["bracket"],
//         heatNo: 6,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B7`,
//         resultName: ["bracket"],
//         heatNo: 7,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R1 B8`,
//         resultName: ["bracket"],
//         heatNo: 8,
//       },
//     ],
//   },
//   [NRXRounds.BR2]: {
//     round: NRXRounds.BR2,
//     roundResultNames: ["Quarterfinal", "Round_2"],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R2 B1`,
//         resultName: ["bracket"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R2 B2`,
//         resultName: ["bracket"],
//         heatNo: 2,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R2 B3`,
//         resultName: ["bracket"],
//         heatNo: 3,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R2 B4`,
//         resultName: ["bracket"],
//         heatNo: 4,
//       },
//     ],
//   },
//   [NRXRounds.BR3]: {
//     round: NRXRounds.BR3,
//     roundResultNames: ["Semifinal", "Round_3"],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R3 B1`,
//         resultName: ["bracket"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R3 B2`,
//         resultName: ["bracket"],
//         heatNo: 2,
//       },
//     ],
//   },
//   [NRXRounds.BR4]: {
//     round: NRXRounds.BR4,
//     roundResultNames: ["Final", "Round_4"],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Battle Bracket R4 B1`,
//         resultName: ["bracket"],
//         heatNo: 1,
//       },
//     ],
//   },
//   [NRXRounds.HEAT_ROUND_1]: {
//     round: NRXRounds.HEAT_ROUND_1,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Heat1 Heat1 Race1`,
//         resultName: ["H1"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Heat2 Heat2 Race1`,
//         resultName: ["H2"],
//         heatNo: 2,
//       },
//     ],
//   },
//   [NRXRounds.SEMIFINALS]: {
//     round: NRXRounds.SEMIFINALS,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Semi-final 1 SF1`,
//         resultName: ["SF1"],
//         heatNo: 1,
//       },
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Semi-final 2 SF2`,
//         resultName: ["SF2"],
//         heatNo: 2,
//       },
//     ],
//   },
//   [NRXRounds.LCQ]: {
//     round: NRXRounds.LCQ,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Last Chance Qualifier LCQ`,
//         resultName: ["LCQ"],
//         heatNo: 1,
//       },
//     ],
//   },
//   [NRXRounds.FINALS]: {
//     round: NRXRounds.FINALS,
//     roundResultNames: [],
//     heats: [
//       {
//         name: `${
//           isSchedule
//             ? NRXScheduleCategoryType[categoryName].name
//             : NRXResultsCategoryType[categoryName].name
//         } Final Final`,
//         resultName: ["FI", "Final"],
//         heatNo: 1,
//       },
//     ],
//   },
// });

export const MASLPeriods = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  OT: 5,
  OT1: 5,
  OT2: 5,
  SO: 6,
};

export enum API_SORT_ORDER {
  DESC = "DESC",
  ASC = "ASC",
}

export enum SimulationWeightTypes {
  YEAR = "year",
  LOCATION = "location",
}

export const OddsTableNames: {
  [key: string]: string;
} = {
  [PublicOddTypes.EVENT_WINNER]: "clientProjectionEventOutcome",
  [PublicOddTypes.EVENT_SECOND_PLACE]: "clientProjectionEventOutcome",
  [PublicOddTypes.HEAT_WINNER]: "clientProjectionEventHeatOutcome",
  [PublicOddTypes.HEAD_TO_HEAD]: "clientPlayerHeadToHeads",
  [PublicOddTypes.SHOWS]: "clientProjectionEventShows",
  [PublicOddTypes.PODIUMS]: "clientProjectionEventPodiums",
  [PublicOddTypes.PROP_BETS]: "clientPropBets",
  [PublicOddTypes.DREAM_TEAM]: "clientProjectionDreamTeam",
  [PublicOddTypes.EVENT_EXACTA]: "clientProjectionExactas",
  // [PublicOddTypes.HEAT_EXACTA]: "clientProjectionExactas",
};
