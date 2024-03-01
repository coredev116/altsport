import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const eventNotFound = (payload = {}) =>
  new CustomHttpException("Event not found", HttpStatus.NOT_FOUND, payload);

export const eventWeightDataIncorrect = (payload = {}) =>
  new CustomHttpException("Event Weight data is not correct", HttpStatus.BAD_REQUEST, payload);
