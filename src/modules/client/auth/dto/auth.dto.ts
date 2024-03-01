import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    name: "username",
    type: "string",
    example: "john.doe@abc.com",
    required: true,
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  username: string;

  /* @ApiProperty({ name: "password", type: "string", example: "testPassword" })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  password: string; */

  @IsString()
  @ApiProperty({
    name: "captchaToken",
    type: "string",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmM",
    required: true,
  })
  captchaToken: string;
}

export class VerifyDto {
  @ApiProperty({
    name: "token",
    type: "string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ name: "code", type: "string", example: "987642" })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ResendCodeDto {
  @ApiProperty({
    name: "token",
    type: "string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class CreateClientDto {
  @ApiProperty({
    name: "firstName",
    type: "string",
    example: "John",
    required: true,
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    name: "lastName",
    type: "string",
    example: "Doe",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    name: "companyName",
    type: "string",
    example: "Sports Analytics",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    name: "companyEmail",
    type: "string",
    example: "john.doe@abc.com",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  companyEmail: string;

  @ApiProperty({
    name: "phone",
    type: "string",
    example: "123456789",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    name: "password",
    type: "string",
    example: "testPassword",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;
}
