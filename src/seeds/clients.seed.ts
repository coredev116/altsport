import { getAuth } from "firebase-admin/auth";
import { Knex } from "knex";

import config from "./config";
import firebase from "../config/firebaseConfig";
import { createClient } from "./helpers/auth.helper";
import { clearFirebaseEmailUsers } from "./helpers/firebase.helper";

import { faker } from "@faker-js/faker";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  const clients = Array(10)
    .fill(1)
    .map(() => faker.internet.email());

  await knex.transaction(async (trx) => {
    try {
      const promises = [];

      promises.push(
        ...clients.map(async (email) => {
          const item = await createClient(email, "Jane", "Doe", "9854120147", "IN");
          const firebaseUser = await getAuth().createUser({
            displayName: `${item.firstName} ${item.lastName}`,
            password: item.password,
            email: item.email,
            emailVerified: true,
          });
          await knex("clients")
            .transacting(trx)
            .insert({
              ...item,
              googleUserId: firebaseUser.uid,
              providerId: "email",
            });

          return item;
        }),
      );

      const result = await Promise.all(promises);

      await Promise.all(
        result.map(async (row) => {
          await knex("clientApiKeys")
            .transacting(trx)
            .insert({
              clientId: row.id,
              totalRequestCount: 100,
              currentRequestCount: 0,
              apiKey: faker.datatype.string(15),
            });

          return true;
        }),
      );

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      await clearFirebaseEmailUsers(clients);
      throw error;
    }
  });
}
