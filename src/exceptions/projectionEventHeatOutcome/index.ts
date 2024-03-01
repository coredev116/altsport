import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const projectionEventHeatOutcomeNotFound = (payload = {}) =>
  new CustomHttpException("Projection Event Heat Outcome not found", HttpStatus.NOT_FOUND, payload);
