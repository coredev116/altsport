import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const projectionEventOutcomeNotFound = (payload = {}) =>
  new CustomHttpException("Projection Event Outcome not found", HttpStatus.NOT_FOUND, payload);
