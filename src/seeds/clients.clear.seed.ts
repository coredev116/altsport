import { Knex } from "knex";

import config from "./config";
import firebase from "../config/firebaseConfig";
import { clearFirebaseEmailUsers } from "./helpers/firebase.helper";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  const preserveEmails = [""];

  await knex.transaction(async (trx) => {
    try {
      const rows = await knex("clients")
        .transacting(trx)
        .whereNotIn("email", preserveEmails)
        .select("email", "id");

      if (!rows.length) return false;

      await knex("clientApiKeys")
        .transacting(trx)
        .whereIn(
          "clientId",
          rows.map((row) => row.id),
        )
        .delete();
      await knex("clientMarketDownloadLogs")
        .transacting(trx)
        .whereIn(
          "clientId",
          rows.map((row) => row.id),
        )
        .delete();
      await knex("clients")
        .transacting(trx)
        .whereIn(
          "email",
          rows.map((row) => row.email),
        )
        .delete();

      try {
        await clearFirebaseEmailUsers(rows.map((item) => item.email));
      } catch (ignoredError) {}

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}
