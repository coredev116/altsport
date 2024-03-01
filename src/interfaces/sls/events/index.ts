export interface IEventListing {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;

  eventStatus: number;
  eventLocation: string;

  year: number;
  league: ILeague;
}

export interface IEventDetails extends IEventListing {
  rounds: IRound[];
}

interface ILeague {
  id: string;
  name: string;
  gender: string;
}

interface IRound {
  id: string;
  name: string;
  roundNo: number;
  roundStatus: number;
  startDate: string | Date;
  endDate: string | Date;
  heats: IHeat[];
}

interface IHeat {
  id: string;
  heatName: string;
  heatNo: number;
  heatStatus: number;
  startDate: string | Date;
  endDate: string | Date;
}
