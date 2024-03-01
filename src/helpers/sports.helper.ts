import { SportsTypes } from "../constants/system";

export const fetchSportName = (sportType: SportsTypes): string => {
  let sportName: string;
  switch (sportType) {
    case SportsTypes.SURFING:
      sportName = "World Surf League";
      break;

    case SportsTypes.SKATEBOARDING:
      sportName = "Skateboarding League";
      break;

    case SportsTypes.RALLYCROSS:
      sportName = "Rallycross";
      break;

    case SportsTypes.SUPERCROSS:
      sportName = "Supercross";
      break;

    case SportsTypes.MASL:
      sportName = "Major Arena Soccer League";
      break;

    case SportsTypes.FDRIFT:
      sportName = "Formula Drift";
      break;

    case SportsTypes.MOTOCROSS:
      sportName = "Pro Motocross";
      break;

    case SportsTypes.F1:
      sportName = "Formula 1";
      break;

    case SportsTypes.MotoGP:
      sportName = "Moto GP";
      break;

    case SportsTypes.MXGP:
      sportName = "Motocross World Championship";
      break;

    case SportsTypes.JA:
      sportName = "Jai Alai";
      break;

    default:
      break;
  }

  return sportName;
};
