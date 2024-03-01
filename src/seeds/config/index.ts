import * as envalid from "envalid";

import { IFirebase } from "../../interfaces/system";

const initialParsedEnv = envalid.cleanEnv(process.env, {
  ENVIRONMENT: envalid.str({
    choices: ["local", "dev", "staging", "release"],
  }),
  FIREBASE_SERVICE_ACCOUNT: envalid.str(),
  JWT_AUTH_SECRET: envalid.str(),
  CLIENT_PORTAL_HOST: envalid.url(),
  MASL_API_KEY: envalid.str(),

  WSL_CLIENT_ID: envalid.str(),
  WSL_CLIENT_SECRET: envalid.str(),

  TWILIO_ACCOUNT_SID: envalid.str(),
  TWILIO_AUTH_TOKEN: envalid.str(),
  TWILIO_MESSAGING_SERVICE_SID: envalid.str(),
});

const firebase: IFirebase = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8"),
);

const isRelease: boolean = initialParsedEnv.ENVIRONMENT === "release";
const isStaging: boolean = initialParsedEnv.ENVIRONMENT === "staging";
const isDevelop: boolean = initialParsedEnv.ENVIRONMENT === "dev";
const isLocal: boolean =
  initialParsedEnv.ENVIRONMENT === "local" ||
  !["development", "production"].includes(initialParsedEnv.ENVIRONMENT);

const config = {
  environment: initialParsedEnv.ENVIRONMENT,
  isLocal,
  isDevelop,
  isStaging,
  isRelease,
  firebase,
  jwtAuthSecret: initialParsedEnv.JWT_AUTH_SECRET,
  clientPortalHostUrl: initialParsedEnv.CLIENT_PORTAL_HOST,
  maslApiKey: initialParsedEnv.MASL_API_KEY,
  twilioAccountSid: initialParsedEnv.TWILIO_ACCOUNT_SID,
  twilioAccountAuthToken: initialParsedEnv.TWILIO_AUTH_TOKEN,
  twilioGenericMessagingServiceId: initialParsedEnv.TWILIO_MESSAGING_SERVICE_SID,
  wslClientId: initialParsedEnv.WSL_CLIENT_ID,
  wslClientSecret: initialParsedEnv.WSL_CLIENT_SECRET,
};

export default config;
