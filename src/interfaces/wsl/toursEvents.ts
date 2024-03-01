export default interface ITourEvents {
  mens: ITourItem[];
  womens: ITourItem[];
}

export interface ITourItem {
  month: number;
  eventId: string;
}
