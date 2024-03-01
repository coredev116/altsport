import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const routeNotFound = new CustomHttpException("Route Not Found", HttpStatus.NOT_FOUND);

export const validationError = (
  message = "Validation Error",
  payload = {},
  httpCode: HttpStatus = HttpStatus.BAD_REQUEST,
) => new CustomHttpException(message, httpCode, payload);

export const thrillOneUnprocessableEntity = (message = "Warning", payload = {}) =>
  new CustomHttpException(message, HttpStatus.NON_AUTHORITATIVE_INFORMATION, payload);

export const publicApiUsageLimit = new CustomHttpException(
  "Public Api usage limit reached",
  HttpStatus.EXPECTATION_FAILED,
);

export const queueNotAvailable = new CustomHttpException(
  "Failed message queue dependency",
  HttpStatus.FAILED_DEPENDENCY,
);

export const unhandledQueueMessage = new CustomHttpException(
  "Unable to handle queue message",
  HttpStatus.EXPECTATION_FAILED,
);

export const propBetOddsDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Prop bets Odds does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const showOddsDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Show Odds does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const podiumOddsDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Podium Odds does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const dreamTeamDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Dream Team does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const eventExactaDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Event Exacta does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const heatExactaDoesNotExist = (payload = {}) =>
  new CustomHttpException(
    "Heat Exacta does not exist for this Sport Type",
    HttpStatus.BAD_REQUEST,
    payload,
  );

export const incorrectSportType = (payload = {}) =>
  new CustomHttpException("Incorrect Sport Type", HttpStatus.BAD_REQUEST, payload);

export const corsError = new CustomHttpException("Not Acceptable", HttpStatus.NOT_ACCEPTABLE);
