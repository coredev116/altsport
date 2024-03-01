import { parse } from "date-fns";

import { Gender } from "./system";

export const enum RoundsMen {
  OPENING_ROUND = 1,
  ELIMINATION_ROUND = 2,
  ROUND32 = 3,
  ROUND16 = 4,
  QUARTERFINALS = 5,
  SEMIFINALS = 6,
  FINALS = 7,
}

export const enum RoundsWomen {
  OPENING_ROUND = 1,
  ELIMINATION_ROUND = 2,
  ROUND16 = 3,
  QUARTERFINALS = 4,
  SEMIFINALS = 5,
  FINALS = 6,
}

// taking in year so that when testing with older events
// it reflects that year instead of the current year
export const postCutDate = (year: number): Date => {
  // const now = new Date();

  const date = parse(`05/15/${year}`, "MM/dd/yyyy", new Date());
  return date;
};

export enum WSLPublicStatsSortColumns {
  ATHLETE = "athlete",
  HEAT_SCORE = "averageHeatScore",
  HEATS_SURFED = "heatsSurfed",
  HEATS_WON = "heatsWon",
  HEAT_WIN_PERCENTAGE = "heatsWinPercentage",
  MAX_HEAT_SCORE = "maxHeatScore",
  MIN_HEAT_SCORE = "minHeatScore",
}

export const fetchOpeningRoundSeedPlacements = (
  isPostCut: boolean,
  gender: Gender,
): {
  [key: number]: number[];
} => {
  if (!isPostCut) {
    return gender === Gender.MALE
      ? {
          1: [6, 19, 31],
          2: [5, 20, 32],
          3: [4, 21, 33],
          4: [3, 22, 34],
          5: [2, 23, 35],
          6: [1, 24, 36],
          7: [7, 18, 30],
          8: [8, 17, 29],
          9: [9, 16, 28],
          10: [10, 15, 27],
          11: [11, 14, 26],
          12: [12, 13, 25],
        }
      : {
          1: [3, 10, 16],
          2: [2, 11, 17],
          3: [1, 12, 18],
          4: [4, 9, 15],
          5: [5, 8, 14],
          6: [6, 7, 13],
        };
  } else {
    return gender === Gender.MALE
      ? {
          1: [4, 13, 21],
          2: [3, 14, 22],
          3: [2, 15, 23],
          4: [1, 16, 24],
          5: [5, 12, 20],
          6: [6, 11, 19],
          7: [7, 10, 18],
          8: [8, 9, 17],
        }
      : {
          1: [4, 5, 9],
          2: [1, 8, 12],
          3: [2, 7, 11],
          4: [3, 6, 10],
        };
  }
};
