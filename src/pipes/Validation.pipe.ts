import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import capitalize from "lodash.capitalize";

import * as systemExceptions from "../exceptions/system";

@Injectable()
class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // get the first error and display that
      let errorMessage = "Validation Error";
      const error = errors?.[0];

      if (error) {
        try {
          errorMessage = Object.values(error?.constraints)?.[0];
        } catch (caughtError) {
          // this might likely be an issue with an array

          if ("children" in error) {
            // this is an error in the array of objects
            try {
              const errorObj = error?.children?.[0]?.children?.[0];
              errorMessage = Object.values(errorObj?.constraints)?.[0];
            } catch (errorArr) {
              throw systemExceptions.validationError();
            }
          }
        }
      }

      throw systemExceptions.validationError(capitalize(errorMessage), errors);
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export default ValidationPipe;
