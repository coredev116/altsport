import { HttpStatus, HttpException } from "@nestjs/common";

import { IExceptionPayload } from "../interfaces/system";

export default class CustomHttpException extends HttpException {
  constructor(message: string, httpStatus: HttpStatus, payload: object = {}) {
    super(
      createExceptionPayload({
        message,
        metadata: payload,
        data: null,
        stack: null,
      }),
      httpStatus,
    );
  }
}

const createExceptionPayload = (payload: IExceptionPayload) => HttpException.createBody(payload);
