import { getAuth, UserRecord, UpdateRequest, CreateRequest } from "firebase-admin/auth";
import { Knex } from "knex";
import { CountryCode } from "libphonenumber-js";

import config from "./config";
import firebase from "../config/firebaseConfig";
import { createUser } from "./helpers/auth.helper";
import { clearFirebaseEmailUsers } from "./helpers/firebase.helper";

import { UserTypes } from "../constants/system";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  const users = [
    {
      firstName: "Shreyog",
      lastName: "",
      email: "shreyog@octalogic.in",
      phone: "9876543210",
      country: "IN",
    },
    {
      firstName: "Dylan",
      lastName: "",
      email: "dylan@octalogic.in",
      phone: "9876543211",
      country: "IN",
    },
    {
      firstName: "Ajay",
      lastName: "",
      email: "ajay@octalogic.in",
      phone: "9876543212",
      country: "IN",
    },
    {
      firstName: "Jude",
      lastName: "",
      email: "jude@octalogic.in",
      phone: "9876543213",
      country: "IN",
    },
  ];

  await knex.transaction(async (trx) => {
    try {
      const promises = [];

      promises.push(
        ...users.map(async (row) => {
          const { phoneParser, ...item } = await createUser(
            UserTypes.TRADER,
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
          await knex("users")
            .transacting(trx)
            .insert({
              ...item,
              googleUserId: firebaseUser.uid,
              providerId: "email",
            });

          return item;
        }),
      );

      await Promise.all(promises);

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      await clearFirebaseEmailUsers(users.map((item) => item.email));
      throw error;
    }
  });
}
