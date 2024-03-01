import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const athleteNotFound = (payload = {}) =>
  new CustomHttpException("Athlete not found", HttpStatus.NOT_FOUND, payload);
