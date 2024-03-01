import { faker } from "@faker-js/faker";
import { subYears } from "date-fns";

import { AthleteStatus } from "../../constants/system";

export const createAthlete = () => ({
  id: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  // generate random age between 20-30
  dob: subYears(new Date(), Math.random() * (30 - 20) + 20).toISOString(),
  nationality: faker.address.country(),
  yearStatus: AthleteStatus.ACTIVE,
  playerStatus: AthleteStatus.ACTIVE,
  yearPoints: 0,
  yearRank: 0,
});
