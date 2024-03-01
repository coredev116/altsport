import { ApiProperty } from "@nestjs/swagger";

class Client {
  @ApiProperty({
    type: "string",
    format: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "John",
    type: "string",
  })
  firstName: string;

  @ApiProperty({
    example: "Doe",
    type: "string",
  })
  lastName: string;

  @ApiProperty({
    example: "9874563210",
    type: "string",
  })
  phone: string;

  @ApiProperty({
    example: "US",
    type: "string",
  })
  country: string;

  @ApiProperty({
    example: "john.doe@abc.com",
    type: "string",
  })
  companyEmail: string;

  @ApiProperty({
    example: "john.doe@abc.com",
    type: "string",
  })
  username: string;
}

class ClientWithPhone {
  @ApiProperty({
    type: "string",
    format: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "John",
    type: "string",
  })
  firstName: string;

  @ApiProperty({
    example: "Doe",
    type: "string",
  })
  lastName: string;

  @ApiProperty({
    example: "john.doe@abc.com",
    type: "string",
  })
  companyEmail: string;

  @ApiProperty({
    example: "john.doe@abc.com",
    type: "string",
  })
  username: string;

  @ApiProperty({
    example: "9912345678",
    type: "string",
  })
  phone: string;

  @ApiProperty({
    example: "US",
    type: "string",
  })
  country: string;
}

export class LoginResponse {
  @ApiProperty({
    type: ClientWithPhone,
  })
  client: ClientWithPhone;

  @ApiProperty({
    example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
    type: "string",
  })
  token: string;
}

export class VerifyResponse {
  @ApiProperty({
    type: Client,
  })
  client: Client;

  @ApiProperty({
    example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
    type: "string",
  })
  token: string;
}

export class OddsNotificationMarket {
  @ApiProperty({
    type: "string",
    format: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Heat Winner",
    type: "string",
  })
  name: string;

  @ApiProperty({
    example: "heatProjections",
    type: "string",
  })
  key: string;
}

export class ResendCodeResponse {
  @ApiProperty({
    type: Client,
  })
  client: Client;
}

export class GetClientResponse extends Client {
  @ApiProperty({
    example: "Super Admin",
    type: "string",
  })
  displayRole: string;

  @ApiProperty({
    type: OddsNotificationMarket,
    isArray: true,
  })
  notificationMarkets: OddsNotificationMarket[];
}

export class OnboardClientResponse {
  @ApiProperty({
    type: "boolean",
    example: true,
    required: false,
    default: false,
  })
  success: boolean;
}
