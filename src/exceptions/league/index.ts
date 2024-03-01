import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const leagueNotFound = (payload = {}) =>
  new CustomHttpException("League not found", HttpStatus.NOT_FOUND, payload);
export const leagueYearNotFound = new CustomHttpException(
  "League year not found!Please add the League year",
  HttpStatus.NOT_FOUND,
);
