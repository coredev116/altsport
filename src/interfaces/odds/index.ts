import { PublicOddTypes } from "../../constants/odds";

export interface IEventOdds {
  id: string;
  position: number;
  odds: number;
  athlete: IAthlete;
}

// export interface IEventHeatOdds {
//   id: string;
//   position: number;
//   odds: number;
//   athlete: IAthlete;
// }

export interface IEventHeatOddsSLS {
  id: string;
  position: number;
  odds: number;
  athlete: IAthlete;
  event: IEvent;
}
// interface IAthlete {
//   id: string;
//   firstName: string;
//   lastName: string;
// }

interface IEvent {
  id: string;
  eventName: string;
  rounds: IRound[];
}

interface IRound {
  id: string;
  roundName: string;
  heats: IHeat[];
}

interface IHeat {
  id: string;
  heatName: string;
  heatNo: number;
  heatStatus: number;
  startDate: Date;
  endDate: Date;
}

// export interface IEventHeatOdds {
//   id: string;
//   name: string;
//   roundNo: number;
//   heats: IHeats[];
// }

// interface IHeats {
//   id: string;
//   name: string;
//   heatStatus: number;
//   athletes: IAthlete[];
// }

interface IAthlete {
  id: string;
  eventParticipantId: string;
  firstName: string;
  lastName: string;
  gender: string;
  nationality: string;
  stance: string;
  odds: number;
  probability: number;
  trueProbability: number;
  hasModifiedProbability: boolean;
  seedNo: number;
}

export interface IOddMarkets {
  [PublicOddTypes.EVENT_WINNER]?: boolean;
  [PublicOddTypes.HEAT_WINNER]?: boolean;
  [PublicOddTypes.HEAD_TO_HEAD]?: boolean;
  [PublicOddTypes.SHOWS]?: boolean;
  [PublicOddTypes.PODIUMS]?: boolean;
  [PublicOddTypes.PROP_BETS]?: boolean;
  [PublicOddTypes.DREAM_TEAM]?: boolean;
  [PublicOddTypes.EVENT_EXACTA]?: boolean;
}
