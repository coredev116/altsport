import { getAuth } from "firebase-admin/auth";
import { Knex } from "knex";

import config from "./config";
import firebase from "../config/firebaseConfig";
import { createClient, createUser } from "./helpers/auth.helper";

import { UserTypes } from "../constants/system";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  await knex.transaction(async (trx) => {
    await clearDb(knex);

    const users = ["user@gmail.com"];
    const clients = ["client@gmail.com"];

    try {
      const promises = [];

      if (users.length)
        promises.push(
          ...users.map(async (email) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { phoneParser, ...item } = await createUser(UserTypes.ADMIN, email);
            const firebaseUser = await getAuth().createUser({
              displayName: `${item.firstName} ${item.lastName}`,
              password: item.password,
              email: item.email,
              emailVerified: true,
            });
            await knex("users")
              .transacting(trx)
              .insert({
                ...item,
                googleUserId: firebaseUser.uid,
                providerId: "email",
              });
          }),
        );

      if (clients.length)
        promises.push(
          ...clients.map(async (email) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { phoneParser, ...item } = await createClient(
              email,
              "Jane",
              "Doe",
              "9854120147",
              "IN",
            );
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
          }),
        );

      await Promise.all(promises);

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

const clearDb = async (knex: Knex) => {
  try {
    await clearFirebaseUsers();

    await knex("clientApiKeys").del();
    await knex("clients").del();
    await knex("users").del();
  } catch (error) {
    throw error;
  }
};

const clearFirebaseUsers = async (nextPageToken?: string) => {
  try {
    const userList = await getAuth().listUsers(100, nextPageToken);
    const userListIds = userList.users.map((user) => user.uid);
    await getAuth().deleteUsers(userListIds);

    if (userList.pageToken) {
      // there are additional pages, recursively delete
      return clearFirebaseUsers(userList.pageToken);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
