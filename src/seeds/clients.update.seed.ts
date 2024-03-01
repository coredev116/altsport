import { getAuth, UserRecord, UpdateRequest, CreateRequest } from "firebase-admin/auth";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";

import config from "./config";
import firebase from "../config/firebaseConfig";

export async function seed() {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  firebase(config.firebase as unknown as string);

  const client = {
    firstName: "Owen",
    lastName: "Wright",
    email: "owen.wright@betfred.com",
    companyName: "",
    phone: "8163155592",
    country: "US" as CountryCode,
  };

  const phoneParser = client.phone ? parsePhoneNumber(client.phone, client.country) : null;
  if (!phoneParser || (phoneParser && !phoneParser.isValid()))
    throw new Error("Invalid phone number");

  const firebaseObj: UpdateRequest | CreateRequest = {
    displayName: `${client.firstName} ${client.lastName}`,
    email: client.email,
    phoneNumber: phoneParser.number,
  };

  let firebaseUser: UserRecord;
  try {
    // check if firebase user already exists
    firebaseUser = await getAuth().getUserByEmail(client.email);
    if (firebaseUser) await getAuth().updateUser(firebaseUser.uid, firebaseObj);
  } catch (error) {
    console.error("🚀 ~ file: clients.update.seed.ts:49 ~ seed ~ error:", error);
  }
}
