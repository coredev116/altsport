import { ApiProperty } from "@nestjs/swagger";

class User {
  @ApiProperty({
    type: "string",
    format: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Jane",
    type: "string",
  })
  firstName: string;

  @ApiProperty({
    example: "John",
    type: "string",
  })
  middleName: string;

  @ApiProperty({
    example: "Doe",
    type: "string",
  })
  lastName: string;

  @ApiProperty({
    example: "doejane@abc.com",
    type: "string",
  })
  email: string;

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
    example: "doejane",
    type: "string",
  })
  username: string;

  @ApiProperty({
    example: "admin",
    type: "string",
  })
  userType: string;
}

export class LoginResponse {
  @ApiProperty({
    type: User,
  })
  user: User;
  @ApiProperty({
    example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
    type: "string",
  })
  token: string;
}

export class GetUserResponse extends User {
  @ApiProperty({
    example: "Super Admin",
    type: "string",
  })
  displayRole: string;
}
