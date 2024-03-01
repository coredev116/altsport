import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const forbidden = new CustomHttpException("Forbidden", HttpStatus.FORBIDDEN);

export const unauthorized = new CustomHttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

export const clientNotFound = new CustomHttpException("User not found", HttpStatus.NOT_FOUND);

export const clientCompleteOnboardingFlow = new CustomHttpException(
  "Please complete your onboarding before logging in.",
  HttpStatus.PRECONDITION_REQUIRED,
);

export const forbiddenFirebase = (message = "Forbidden") =>
  new CustomHttpException(message, HttpStatus.FORBIDDEN);

export const incorrectUsernamePassword = (payload = {}) =>
  new CustomHttpException("Incorrect username/password", HttpStatus.FORBIDDEN, payload);

export const verificationCodeMismatch = (payload = {}) =>
  new CustomHttpException("Incorrect verification code", HttpStatus.BAD_REQUEST, payload);

export const invalidPhoneNumber = (payload = {}) =>
  new CustomHttpException("Incorrect phone number", HttpStatus.FORBIDDEN, payload);

export const invalidToken = (payload = {}) =>
  new CustomHttpException("Invalid Token", HttpStatus.FORBIDDEN, payload);

export const incorrectClientUsertype = (payload = {}) =>
  new CustomHttpException(
    "Incorrect Client Usertype. User is available",
    HttpStatus.PRECONDITION_FAILED,
    payload,
  );

export const userIdNotPresent = (payload = {}) =>
  new CustomHttpException("User Id is not present", HttpStatus.FORBIDDEN, payload);

export const emailAlreadyExists = (payload = {}) =>
  new CustomHttpException("email already exists", HttpStatus.PRECONDITION_FAILED, payload);

/* Recaptcha Errors */
export const unableToVerifyUserRecaptch = (message = "The request is invalid or malformed") =>
  new CustomHttpException(message, HttpStatus.PRECONDITION_FAILED);
/* Recaptcha Errors */
