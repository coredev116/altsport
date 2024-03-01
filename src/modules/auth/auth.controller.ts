import { Body, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { getAuth } from "firebase-admin/auth";
import * as argon2 from "argon2";

import { AuthService } from "./auth.service";

import { LoginDto } from "./dto/auth.dto";

import { GetUserResponse, LoginResponse } from "./schemas/response";

import { AuthConstants } from "../../constants/auth";

import * as authExceptions from "../../exceptions/auth";

import ApiGuard from "../../guards/adminApi.guard";
import CaptchaGuard from "../../guards/captcha.guard";

import { User } from "../../decorators/user.decorator";

@ApiTags("Auth")
@Controller({
  path: "admin/auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({
    type: LoginDto,
    description: "The details of the user i.e. username, password and usertype",
  })
  @ApiResponse({
    type: LoginResponse,
    description: "The response returns a data object with user and token",
  })
  @UseGuards(CaptchaGuard)
  @Post("login")
  async verifyLogin(@Body() userData: LoginDto): Promise<LoginResponse> {
    const item = await this.authService.getUser(userData);
    if (!item) throw authExceptions.incorrectUsernamePassword();

    const verifiedBool = await argon2.verify(item.password, userData.password);
    if (!verifiedBool) throw authExceptions.incorrectUsernamePassword();

    const additionalClaims = {
      [AuthConstants.FIREBASE_CLAIM_USER_TYPE]: userData.userType,
      [AuthConstants.FIREBASE_CLAIM_USER_ID]: item.id,
      // [AuthConstants.FIREBASE_CLAIM_TIMEZOME]: "IST",
    };

    const customGoogleToken = await getAuth().createCustomToken(
      item.googleUserId,
      additionalClaims,
    );

    const { id, firstName, middleName, lastName, email, username } = item;

    return {
      user: {
        id,
        firstName,
        middleName,
        lastName,
        email,
        username,
        country: item.country,
        phone: item.phone,
        userType: "admin",
      },
      token: customGoogleToken,
    };
  }

  @ApiBearerAuth()
  @UseGuards(ApiGuard)
  @ApiOperation({
    summary: "Admin Fetch Profile Details",
    description: "Fetch admin profile details",
    operationId: "adminProfile",
  })
  @ApiResponse({
    type: GetUserResponse,
    description: "The response returns a data object with user",
  })
  @Get("me")
  async getUser(@User("userId") userId: string): Promise<GetUserResponse> {
    if (!userId) throw authExceptions.unauthorized;

    return this.authService.getUserById(userId);
  }

  /* @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdateUserDto,
    description: "The details of the of the fields to be updated",
  })
  @ApiResponse({
    type: GetUserResponse,
    description: "The response returns a data object with user",
  })
  @Post("me")
  async updateUser(
    @User("userId") userId: string,
    @User("userType") userType: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<GetUserResponse> {
    return this.authService.updateUserById(userId, userType, updateData);
  } */
}
