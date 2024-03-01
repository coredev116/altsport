import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const roundNotFound = (payload = {}) =>
  new CustomHttpException("Round not found", HttpStatus.NOT_FOUND, payload);
