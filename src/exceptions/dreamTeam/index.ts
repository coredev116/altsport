import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const voidAndWinnerRequest = new CustomHttpException(
  "Cannot void or draw at the same time",
  HttpStatus.BAD_REQUEST,
);
