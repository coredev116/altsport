import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";

import { UserTypes } from "../../constants/system";

export const createClient = async (
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  country: CountryCode,
) => {
  const userEmail = email || faker.internet.email();

  const phoneParser = phone ? parsePhoneNumber(phone, country) : null;
  if (!phoneParser || (phoneParser && !phoneParser.isValid()))
    throw new Error("Invalid phone number" + phone);

  return {
    id: faker.datatype.uuid(),
    firstName: firstName || faker.name.firstName(),
    lastName: lastName || faker.name.lastName(),
    phone: phone || null,
    // generate random age between 20-30
    email: userEmail,
    username: phone,
    password: await argon2.hash(email),
    country,
    providerId: "email",
    phoneParser,
  };
};

export const createUser = async (
  userType: UserTypes,
  email?: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  country?: CountryCode,
) => {
  const userEmail = email || faker.internet.email();

  const phoneParser = phone ? parsePhoneNumber(phone, country) : null;
  if (phone && (!phoneParser || (phoneParser && !phoneParser.isValid())))
    throw new Error("Invalid phone number" + phone);

  return {
    id: faker.datatype.uuid(),
    firstName: firstName || faker.name.firstName(),
    lastName: lastName || faker.name.lastName(),
    phone: phone || null,
    // generate random age between 20-30
    email: userEmail,
    username: userEmail,
    password: await argon2.hash(email),
    userType,
    providerId: "email",
    country,
    phoneParser,
  };
};
