import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export default class NotFoundFilter<T extends NotFoundException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const responseBody = {
      statusCode: exception.getStatus(),
      message: "API Not Found",
      data: null,
      metadata: null,
      stack: null,
      timestamp: new Date().toISOString(),
    };

    host.switchToHttp().getResponse().status(exception.getStatus()).send(responseBody);
  }
}
