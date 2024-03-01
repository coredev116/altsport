import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

import * as authException from "../exceptions/auth";

export interface IRecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  "error-codes": string[];
}

const GOOGLE_RECAPTCHA_MIN_SCORE = 0.4;

@Injectable()
export default class CaptchaGuard implements CanActivate {
  constructor(public configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const captchaToken: string = request.body.captchaToken;
    if (!captchaToken) throw authException.forbidden;

    // verify if captcha token is valid
    const isValidRequest = await verifyCaptcha(
      captchaToken,
      this.configService.get<string>("googleCaptchaSecret"),
    );
    if (!isValidRequest.success || isValidRequest.score <= GOOGLE_RECAPTCHA_MIN_SCORE)
      throw authException.unableToVerifyUserRecaptch("Unauthorized request");

    return true;
  }
}

export const verifyCaptcha = async (token: string, secret: string): Promise<IRecaptchaResponse> => {
  try {
    const response = await axios.post<IRecaptchaResponse>(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret,
          response: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw authException.unableToVerifyUserRecaptch();
  }
};
