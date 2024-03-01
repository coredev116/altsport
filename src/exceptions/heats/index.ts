import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const heatNotFound = (payload = {}) =>
  new CustomHttpException("Heat not found", HttpStatus.NOT_FOUND, payload);

export const cannotHaveDuplicatePositions = new CustomHttpException(
  "Cannot have the same heat position for more than one player",
  HttpStatus.PRECONDITION_FAILED,
);

export const cannotHaveDuplicatePlayers = new CustomHttpException(
  "Cannot have duplicate players",
  HttpStatus.BAD_REQUEST,
);

export const heatAlreadyVoided = new CustomHttpException(
  "Heat already voided",
  HttpStatus.PRECONDITION_FAILED,
);

export const missingHeatStartDate = new CustomHttpException(
  "A live heat should have a start date.",
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const missingHeatStartEndForCompletedHeat = new CustomHttpException(
  "A completed heat should have a start and end date along with the heat status as completed.",
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const heatAlreadyEnded = new CustomHttpException(
  "This heat has already ended.",
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const markHeatLiveBeforeEndingError = new CustomHttpException(
  "Please mark the heat live and save before clicking to end the heat.",
  HttpStatus.PRECONDITION_FAILED,
);

export const cannotEndHeatWithNoWinnersError = new CustomHttpException(
  "Please make sure that the heat has a winner.",
  HttpStatus.PRECONDITION_REQUIRED,
);
