import { getAuth, UserRecord, UpdateRequest, CreateRequest } from "firebase-admin/auth";
import { Knex } from "knex";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";
import Twilio from "twilio";

import config from "./config";
import firebase from "../config/firebaseConfig";

import { createClient } from "./helpers/auth.helper";
import { clearFirebaseEmailUsers } from "./helpers/firebase.helper";

import { createJwtToken } from "../helpers/jsonWebToken.helper";

import { IClientCreateTokenPayload } from "../interfaces/auth/client";

import { faker } from "@faker-js/faker";

type CreatedClient = {
  id: string;
  firstName: string;
  phone: string;
  country: CountryCode;
};

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  const clients = Array(5)
    .fill(1)
    .map((_, index) => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      companyName: faker.company.name(),
      phone: `987654322${index + 1}`,
      country: "IN",
    }));

  await knex.transaction(async (trx) => {
    try {
      const promises = [];

      promises.push(
        ...clients.map(async (row) => {
          const { phoneParser, ...item } = await createClient(
            row.email,
            row.firstName,
            row.lastName,
            row.phone,
            row.country as CountryCode,
          );

          const firebaseObj: UpdateRequest | CreateRequest = {
            displayName: `${item.firstName} ${item.lastName}`,
            password: item.password,
            email: item.email,
            emailVerified: true,
          };
          if (item.phone) firebaseObj.phoneNumber = phoneParser.number;

          let firebaseUser: UserRecord;
          try {
            // check if firebase user already exists
            firebaseUser = await getAuth().getUserByEmail(item.email);
            if (firebaseUser) await getAuth().updateUser(firebaseUser.uid, firebaseObj);
          } catch (ignoredError) {}

          if (!firebaseUser) firebaseUser = await getAuth().createUser(firebaseObj);

          const insertedRow = await knex("clients")
            .transacting(trx)
            .insert({
              ...item,
              googleUserId: firebaseUser.uid,
              providerId: "email",
            })
            .returning("id");
          const insertId: string = insertedRow[0].id;

          return {
            id: insertId,
            firstName: item.firstName,
            country: item.country,
            phone: item.phone,
          } as CreatedClient;
        }),
      );

      const insertedClients = await Promise.all<CreatedClient[]>(promises);

      // FIXME: remove this for prod
      return;
      await Promise.all(
        insertedClients.map((row) => textSignupLink(row.firstName, row.phone, row.country, row.id)),
      );

      /* await Promise.all(
        result.map(async (row) => {
          await knex("clientApiKeys")
            .transacting(trx)
            .insert({
              clientId: row.id,
              totalRequestCount: 500_000,
              currentRequestCount: 0,
              apiKey: `${config.environment}_key_${faker.random.alphaNumeric(64)}`.substring(0, 64),
            });

          return true;
        }),
      ); */

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      await clearFirebaseEmailUsers(clients.map((item) => item.email));
      throw error;
    }
  });
}

const textSignupLink = async (
  firstName: string,
  phone: string,
  country: CountryCode,
  clientId: string,
): Promise<string> => {
  try {
    const phoneParser = parsePhoneNumber(phone, country);

    if (!phoneParser || (phoneParser && !phoneParser.isValid()))
      throw new Error("Invalid phone number");

    const token = createJwtToken<IClientCreateTokenPayload>(
      config.jwtAuthSecret,
      {
        id: clientId,
        userType: "client",
      },
      "/auth/client/create",
      undefined,
      "create_client",
      60 * 60 * 24 * 7, // 1 week time
    );

    const link = `${config.clientPortalHostUrl}/auth/signup/onboard?token=${token}`;

    const textMessage = `Welcome to Alt Sports Data, ${firstName}! Here is the link to set up your account: ${link}`;

    if (config.isLocal) return textMessage;
    const client: Twilio.Twilio = Twilio(config.twilioAccountSid, config.twilioAccountAuthToken, {
      lazyLoading: false,
      edge: "umatilla", // US Oregon
    });

    await client.messages.create({
      to: `${phoneParser.number}`,
      from: config.twilioGenericMessagingServiceId,
      body: textMessage,
    });

    return textMessage;
  } catch (error) {
    throw error;
  }
};
