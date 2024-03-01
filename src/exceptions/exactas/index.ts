import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const exactasNotFound = new CustomHttpException("exactas not found", HttpStatus.NOT_FOUND);

export const voidAndWinnerRequest = new CustomHttpException(
  "Cannot void, declare winner or draw at the same time",
  HttpStatus.BAD_REQUEST,
);

export const heatIdMissing = new CustomHttpException(
  "heat id missing for given exacta",
  HttpStatus.BAD_REQUEST,
);
