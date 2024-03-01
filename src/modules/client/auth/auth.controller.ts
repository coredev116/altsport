import { Body, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { getAuth } from "firebase-admin/auth";

import { AuthService } from "./auth.service";
import TwilioService from "../../../services/twilio.service";

import { createJwtToken, verifyJwtToken } from "../../../helpers/jsonWebToken.helper";

import { LoginDto, CreateClientDto, VerifyDto, ResendCodeDto } from "./dto/auth.dto";
import { OnboardDto } from "./dto/onboard.dto";

import ApiGuard from "../../../guards/clientApi.guard";
import CaptchaGuard from "../../../guards/captcha.guard";

import { User } from "../../../decorators/user.decorator";

import {
  LoginResponse,
  GetClientResponse,
  VerifyResponse,
  ResendCodeResponse,
  OnboardClientResponse,
} from "./schemas/response";

import { AuthConstants } from "../../../constants/auth";
import { DEFAULT_COUNTRY } from "../../../constants/system";

import {
  IClientLoginTokenPayload,
  IClientCreateTokenPayload,
} from "../../../interfaces/auth/client";

import * as authExceptions from "../../../exceptions/auth";

@ApiTags("Auth")
@Controller({
  path: "client/auth",
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twilioService: TwilioService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.twilioService.init();
  }

  @ApiBody({
    type: LoginDto,
    description: "The details of the client i.e. username, password",
  })
  @ApiOperation({
    summary: "Client Login",
    description: "Client Login",
  })
  @ApiResponse({
    type: LoginResponse,
    description: "The response returns a data object with user and token",
  })
  @UseGuards(CaptchaGuard)
  @Post("login")
  async login(@Body() userData: LoginDto): Promise<LoginResponse> {
    const item = await this.authService.getClient(userData.username);

    if (!item) throw authExceptions.incorrectUsernamePassword();
    if (!item.phone) throw authExceptions.invalidPhoneNumber();
    if (!item.hasOnboarded) throw authExceptions.clientCompleteOnboardingFlow;

    // const verifiedBool = await argon2.verify(item.password, userData.password);
    // if (!verifiedBool) throw authExceptions.incorrectUsernamePassword();

    const token = createJwtToken<IClientLoginTokenPayload>(
      this.configService.get("jwtAuthSecret"),
      {
        username: userData.username,
        userType: "client",
      },
      "/auth/client/login",
    );
    await this.twilioService.sendAuthVerificationMessage({
      to: item.phone,
      country: item.country || DEFAULT_COUNTRY,
    });

    const { id, firstName, lastName, email, username, phone } = item;

    return {
      client: {
        id,
        firstName,
        lastName,
        companyEmail: email,
        username,
        phone,
        country: item.country,
      },
      token,
    };
  }

  @ApiBody({
    type: CreateClientDto,
    description: "The details of the client to be added",
  })
  @ApiOperation({
    summary: "Client Sign Up",
    description: "Client Sign Up",
  })
  @ApiResponse({
    type: GetClientResponse,
    description: "The response returns a data object with user",
  })
  @Post("signup")
  async createClient(@Body() clientData: CreateClientDto): Promise<GetClientResponse> {
    const client = await this.authService.getClient(clientData.companyEmail);

    if (client) throw authExceptions.emailAlreadyExists();

    const item = await this.authService.createClient(clientData);

    const { id, firstName, lastName, email, username } = item;

    return {
      id,
      firstName,
      lastName,
      companyEmail: email,
      username,
      displayRole: "Client",
      country: item.country,
      phone: item.phone,
      notificationMarkets: [],
    };
  }

  @ApiBody({
    type: VerifyDto,
    description: "Verify Client Login",
  })
  @ApiOperation({
    summary: "Verify Client Login",
    description: "Verify Client Login",
  })
  @ApiResponse({
    type: VerifyResponse,
    description: "The response returns a data object with user and token",
  })
  @Post("verify")
  async verify(@Body() clientData: VerifyDto): Promise<VerifyResponse> {
    const token = verifyJwtToken<IClientLoginTokenPayload>(
      this.configService.get("jwtAuthSecret"),
      clientData.token,
      {
        audience: "/auth/client/login",
        issuer: "/auth/client",
        subject: "client",
      },
    );
    if (token.userType !== "client") {
      throw authExceptions.unauthorized;
    }

    const item = await this.authService.getClient(token.username);
    if (!item) throw authExceptions.incorrectUsernamePassword();

    const isValidCode = await this.twilioService.verifyAuthenticationCode({
      to: item.phone,
      country: item.country || DEFAULT_COUNTRY,
      code: clientData.code,
    });
    if (!isValidCode) throw authExceptions.verificationCodeMismatch();

    const additionalClaims = {
      [AuthConstants.FIREBASE_CLAIM_USER_TYPE]: "client",
      [AuthConstants.FIREBASE_CLAIM_USER_ID]: item.id,
      // [AuthConstants.FIREBASE_CLAIM_TIMEZOME]: "IST",
    };

    if (!item.isPhoneVerified) await this.authService.verifyPhoneNumber(item.id);

    const customGoogleToken = await getAuth().createCustomToken(
      item.googleUserId,
      additionalClaims,
    );

    const { id, firstName, lastName, email, username } = item;

    return {
      client: {
        id,
        firstName,
        lastName,
        companyEmail: email,
        username,
        country: item.country,
        phone: item.phone,
      },
      token: customGoogleToken,
    };
  }

  @ApiBody({
    type: ResendCodeDto,
    description: "Resend Verification Code",
  })
  @ApiOperation({
    summary: "Resend Verification Code",
    description: "Resend Verification Code",
  })
  @ApiResponse({
    type: ResendCodeResponse,
    description: "The response returns a data object with user",
  })
  @Post("resend")
  async resendCode(@Body() clientData: ResendCodeDto): Promise<ResendCodeResponse> {
    const token = verifyJwtToken<IClientLoginTokenPayload>(
      this.configService.get("jwtAuthSecret"),
      clientData.token,
      {
        audience: "/auth/client/login",
        issuer: "/auth/client",
        subject: "client",
      },
    );
    if (token.userType !== "client") {
      throw authExceptions.unauthorized;
    }

    const item = await this.authService.getClient(token.username);
    if (!item) throw authExceptions.incorrectUsernamePassword();

    await this.twilioService.sendAuthVerificationMessage({
      to: item.phone,
      country: item.country || DEFAULT_COUNTRY,
    });

    const { id, firstName, lastName, email, username } = item;

    return {
      client: {
        id,
        firstName,
        lastName,
        companyEmail: email,
        username,
        country: item.country,
        phone: item.phone,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(ApiGuard)
  @ApiOperation({
    summary: "Client Fetch Profile Details",
    description: "Fetch client profile details",
    operationId: "clientProfile",
  })
  @ApiResponse({
    type: GetClientResponse,
    description: "The response returns a data object with user",
  })
  @Get("me")
  async getUser(@User("userId") userId: string): Promise<GetClientResponse> {
    if (!userId) throw authExceptions.unauthorized;
    return this.authService.getClientById(userId);
  }

  @ApiBody({
    type: OnboardDto,
    description: "Onboard client",
  })
  @ApiOperation({
    summary: "Onboard a client",
    description: "Onboard a client",
  })
  @ApiResponse({
    type: OnboardClientResponse,
  })
  @Post("signup/onboard")
  async onboardClient(@Body() clientData: OnboardDto): Promise<OnboardClientResponse> {
    const token = verifyJwtToken<IClientCreateTokenPayload>(
      this.configService.get("jwtAuthSecret"),
      clientData.token,
      {
        audience: "/auth/client/create",
        issuer: "/auth/client",
        subject: "create_client",
      },
    );
    if (token.userType !== "client") throw authExceptions.unauthorized;

    const client = await this.authService.getClientById(token.id);
    if (!client) throw authExceptions.clientNotFound;
    const clientRow = await this.authService.getClient(client.username);
    if (clientRow.hasOnboarded) throw authExceptions.unauthorized;

    await this.authService.onboardClient(client.id, clientData);

    return {
      success: true,
    };
  }
}
