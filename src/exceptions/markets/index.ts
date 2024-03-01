import { HttpStatus } from "@nestjs/common";

import CustomHttpException from "../../utils/CustomHttpException";

export const marketNotFound = new CustomHttpException("Market not found", HttpStatus.NOT_FOUND);
