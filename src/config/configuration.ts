import path from "path";
import fs from "fs";

import { ISystemConfig, IFirebase } from "../interfaces/system";

import { Environment, NodeEnvironment } from "../constants/system";

export default (): ISystemConfig => {
  const filepath = path.resolve(path.join(__dirname), "../../VERSION.txt");
  const appVersion = fs.readFileSync(filepath, "utf8");

  const environment = process.env.ENVIRONMENT;

  const firebase: IFirebase = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8"),
  );

  return {
    database: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    environment: process.env.ENVIRONMENT as Environment,
    nodeEnvironment: process.env.NODE_ENV as NodeEnvironment,
    appPort: +process.env.APP_PORT,
    apiHost: process.env.API_HOST,
    appVersion: `${environment}-${appVersion.replace(/(\r\n|\n|\r)/gm, "")}`,
    firebase,

    googleCaptchaSecret: process.env.RECAPTCHA_SECRET_KEY,

    slack: {
      deployment: process.env.SLACK_DEPLOYMENT_HOOK,
      genericLogging: process.env.SLACK_LOGGING_HOOK,
    },

    client: {
      host: process.env.CLIENT_PORTAL_HOST,
    },

    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      accountAuthToken: process.env.TWILIO_AUTH_TOKEN,
      genericAuthServiceId: process.env.TWILIO_AUTH_SERVICE_SID,
      genericMessagingServiceId: process.env.TWILIO_MESSAGING_SERVICE_SID,
    },

    jaiAlaiPusher: {
      appKey: process.env.JAI_ALAI_PUSHER_APP_KEY,
      cluster: process.env.JAI_ALAI_PUSHER_CLUSTER,
      channel: process.env.JAI_ALAI_PUSHER_CHANNEL,
      wsHost: process.env.JAI_ALAI_PUSHER_HOST,
      wsPort: +process.env.JAI_ALAI_PUSHER_PORT,
    },

    jaiAlaiApiKey: process.env.JA_API_KEY,
    jaiOddsOutputApiBaseUrl: process.env.JAI_ODDS_OUTPUT_API_BASE_URL,

    jwtAuthSecret: process.env.JWT_AUTH_SECRET,

    maslApiKey: process.env.MASL_API_KEY,
    wslClientId: process.env.WSL_CLIENT_ID,
    wslClientSecret: process.env.WSL_CLIENT_SECRET,

    aws: {
      sqs: {
        accessKeyId: process.env.SQS_ACCESS_KEY,
        secretAccessKey: process.env.SQS_SECRET_KEY,
        region: process.env.SQS_REGION,
      },
    },

    openBetClient: {
      clientId: process.env.OPEN_BET_CLIENT_ID,
      secretKey: process.env.OPEN_BET_CLIENT_SECRET,
      proxyApiKey: process.env.PROXY_OPEN_BET_API_KEY,
    },

    isDevelop: environment === Environment.Develop,
    isStaging: environment === Environment.Staging,
    isRelease: environment === Environment.Release,
    isProdCompiled: process.env.NODE_ENV === NodeEnvironment.Production,
  };
};
