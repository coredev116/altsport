import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Twilio from "twilio";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";

import * as authExceptions from "../exceptions/auth";

type twilioAuthRequest = {
  to: string;
  country: CountryCode;
};

type twilioAuthVerificationRequest = {
  to: string;
  code: string;
  country: CountryCode;
};

type twilioMessageRequest = {
  message: string;
  to: string;
  country: CountryCode;
};

@Injectable()
export default class TwilioService {
  private client: Twilio.Twilio;
  private isStaging: boolean;
  private isRelease: boolean;
  private isDevelop: boolean;

  constructor(public configService: ConfigService) {
    this.client = Twilio(
      this.configService.get<string>("twilio.accountSid"),
      this.configService.get<string>("twilio.accountAuthToken"),
      {
        lazyLoading: false,
        edge: "umatilla", // US Oregon
      },
    );

    this.isStaging = this.configService.get<boolean>("isStaging");
    this.isRelease = this.configService.get<boolean>("isRelease");
    this.isDevelop = this.configService.get<boolean>("isDevelop");
  }

  isAllowed(): boolean {
    return this.isDevelop || this.isRelease || this.isStaging;
  }

  async init() {
    try {
      if (!this.isAllowed()) return false;

      const authServiceId: string = this.configService.get<string>("twilio.genericAuthServiceId");
      const authRateLimits = await this.client.verify
        .services(authServiceId)
        .rateLimits.list({ limit: 5 });

      let phoneNumberRateLimit = authRateLimits.find(
        (rateLimit) => rateLimit.uniqueName === `phone_number`,
      );

      if (!phoneNumberRateLimit)
        phoneNumberRateLimit = await this.client.verify.services(authServiceId).rateLimits.create({
          description: "Limit end user based on the phone number",
          uniqueName: `phone_number`,
        });

      const phoneNumberRateBuckets = await this.client.verify
        .services(authServiceId)
        .rateLimits(phoneNumberRateLimit.sid)
        .buckets.list({ limit: 5 });

      // 1 every 30 seconds
      if (phoneNumberRateBuckets.length <= 0)
        await this.client.verify
          .services(authServiceId)
          .rateLimits(phoneNumberRateLimit.sid)
          .buckets.create({ max: 1, interval: 30 });
      else {
        const phoneNumberRateBucket = phoneNumberRateBuckets[0];

        await this.client.verify
          .services(authServiceId)
          .rateLimits(phoneNumberRateLimit.sid)
          .buckets(phoneNumberRateBucket.sid)
          .update({ max: 1, interval: 30 });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendAuthVerificationMessage(requestPayload: twilioAuthRequest) {
    try {
      if (!this.isRelease && !this.isStaging) return true;

      const phoneParser = parsePhoneNumber(`${requestPayload.to}`, requestPayload.country);

      if (!phoneParser || (phoneParser && !phoneParser.isValid()))
        throw authExceptions.invalidPhoneNumber();

      const result = await this.client.verify
        .services(this.configService.get<string>("twilio.genericAuthServiceId"))
        .verifications.create({
          to: `${phoneParser.number}`,
          channel: "sms",
          rateLimits: {
            phone_number: `${phoneParser.number}`,
          },
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async verifyAuthenticationCode(requestPayload: twilioAuthVerificationRequest): Promise<boolean> {
    try {
      if (!this.isRelease && !this.isStaging) return true;

      const phoneParser = parsePhoneNumber(`${requestPayload.to}`, requestPayload.country);

      if (!phoneParser || (phoneParser && !phoneParser.isValid()))
        throw authExceptions.invalidPhoneNumber();

      const result = await this.client.verify
        .services(this.configService.get<string>("twilio.genericAuthServiceId"))
        .verificationChecks.create({
          to: `${phoneParser.number}`,
          code: requestPayload.code,
        });

      return result.status === "approved";
    } catch (error) {
      throw error;
    }
  }

  /**
   * used to send a message to the twillio messaging service
   *
   * @param {twilioMessageRequest} requestPayload - payload to be sent to twilio
   */
  async sendGenericMessage(requestPayload: twilioMessageRequest) {
    try {
      if (!this.isAllowed()) return true;

      const phoneParser = parsePhoneNumber(`${requestPayload.to}`, requestPayload.country);

      if (!phoneParser || (phoneParser && !phoneParser.isValid()))
        throw authExceptions.invalidPhoneNumber();

      await this.client.messages.create({
        to: `${phoneParser.number}`,
        from: this.configService.get<string>("twilio.genericMessagingServiceId"),
        body: requestPayload.message,
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
