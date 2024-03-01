import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @ApiProperty({
    name: "username",
    type: "string",
    example: "client@gmail.com",
    required: true,
  })
  username: string;

  @IsString()
  @ApiProperty({ name: "password", type: "string", example: "testpassword", required: true })
  password: string;

  @IsString()
  @ApiProperty({ name: "userType", type: "string", example: "user", enum: ["user"] })
  userType: string;

  @IsString()
  @ApiProperty({
    name: "captchaToken",
    type: "string",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmM",
    required: true,
  })
  captchaToken: string;
}

export class GetUserDto {
  @IsString()
  @ApiProperty({
    name: "token",
    type: "string",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.",
  })
  token: string;
}

export class UpdateUserDto {
  @IsString()
  @ApiProperty({
    name: "firstName",
    type: "string",
    example: "John",
    required: true,
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    name: "middleName",
    type: "string",
    example: "Jane",
  })
  middleName: string;

  @IsString()
  @ApiProperty({
    name: "lastName",
    type: "string",
    example: "Doe",
  })
  lastName: string;

  @IsString()
  @ApiProperty({
    name: "email",
    type: "string",
    example: "client@gmail.com",
  })
  email: string;
}
