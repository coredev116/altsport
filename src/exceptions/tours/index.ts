import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const tourNotFound = (payload = {}) =>
  new CustomHttpException("Tour not found", HttpStatus.NOT_FOUND, payload);
export const tourYearNotFound = new CustomHttpException(
  "Tour year not found!Please add the tour year",
  HttpStatus.NOT_FOUND,
);
