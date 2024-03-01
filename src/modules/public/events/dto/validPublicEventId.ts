import { registerDecorator } from "class-validator";
import isUuidValidator from "validator/lib/isUUID";

export function ValidPublicEventId() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "validPublicEventId",
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return (
            typeof value === "string" &&
            typeof value?.split(":")[1] === "string" &&
            isUuidValidator(value?.split(":")[1], "4")
          );
        },
        defaultMessage() {
          return "$value should contain sportType and valid UUID";
        },
      },
    });
  };
}
