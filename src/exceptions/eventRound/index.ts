import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const eventRoundNotFound = (payload = {}) =>
  new CustomHttpException("Event Round not found", HttpStatus.NOT_FOUND, payload);
