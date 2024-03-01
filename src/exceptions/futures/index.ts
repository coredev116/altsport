import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const futuresNotFound = (payload = {}) =>
  new CustomHttpException("Future not found", HttpStatus.NOT_FOUND, payload);
