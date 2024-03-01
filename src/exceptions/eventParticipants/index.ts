import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const eventParticipantNotFound = new CustomHttpException(
  "Event Participant not found",
  HttpStatus.NOT_FOUND,
);

export const invalidParticipantForEvent = new CustomHttpException(
  "Athlete is not part of this event",
  HttpStatus.BAD_REQUEST,
);
