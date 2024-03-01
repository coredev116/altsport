import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import {
  EntityNotFoundError,
  QueryFailedError,
  EntityMetadataNotFoundError,
  TypeORMError,
} from "typeorm";

import { IException } from "../interfaces/system";

import AppConfig from "../config/appConfig";

import SlackService from "../services/slack.service";

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly slackService: SlackService,
  ) {}

  catch<T extends Error>(exception: T, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "";
    let metadata = null;
    let stack = null;

    const isRelease: boolean = AppConfig.get<boolean>("isRelease");

    if (exception instanceof HttpException) {
      const httpException: IException = exception as unknown as IException;
      statusCode = exception.getStatus();
      message = httpException?.response?.message || null;
      metadata = !isRelease ? httpException?.response?.metadata || null : null;
      stack = !isRelease ? httpException?.response?.stack || exception?.stack || null : null;
    } else if (
      exception instanceof EntityNotFoundError ||
      exception instanceof QueryFailedError ||
      exception instanceof EntityMetadataNotFoundError ||
      exception instanceof TypeORMError
    ) {
      // typeorm error
      message = exception?.message || "";
      stack = !isRelease ? exception?.stack || null : null;
    } else {
      message = exception?.message || "";
      stack = !isRelease ? exception?.stack || null : null;
    }

    const responseBody = {
      statusCode,
      message,
      data: null,
      metadata,
      stack,
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      const errorLogPayload = {
        title: "Application Error",
        payload: {
          url: request.url,
          method: request.method,
          body: request.body,
        },
        stack: stack || null,
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.slackService.dumpLog(errorLogPayload);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

export default AllExceptionsFilter;
