import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const propBetNotFound = new CustomHttpException("Prop Bet not found", HttpStatus.NOT_FOUND);

export const propBetPayoutAlreadyPaid = new CustomHttpException(
  "Bet already paid out",
  HttpStatus.PRECONDITION_FAILED,
);

export const propBetVoided = new CustomHttpException(
  "Bet was previously voided",
  HttpStatus.PRECONDITION_REQUIRED,
);

export const cannotPayoutAndVoid = new CustomHttpException(
  "Cannot payout and void bet at the same time",
  HttpStatus.BAD_REQUEST,
);
