import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const playerHeadToHeadsNotFound = new CustomHttpException(
  "Head to head matchup not found",
  HttpStatus.NOT_FOUND,
);

export const sameEventParticipantIds = new CustomHttpException(
  "Cannot create a head to head match with the same athlete.",
  HttpStatus.BAD_REQUEST,
);

export const voidAndWinnerRequest = new CustomHttpException(
  "Cannot void, declare winner or draw at the same time",
  HttpStatus.BAD_REQUEST,
);

export const cannotUpdateheadToHeadPaidOut = new CustomHttpException(
  "Cannot update head to head matchup after it has been paid out.",
  HttpStatus.PRECONDITION_FAILED,
);
