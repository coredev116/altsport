import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class OnboardDto {
  @ApiProperty({
    name: "password",
    type: "string",
    example: "testPassword",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: "token",
    type: "string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI",
  })
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    type: "boolean",
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  isSmsNotificationEnabled: boolean;

  @ApiProperty({
    type: "boolean",
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  isEmailNotificationEnabled: boolean;
}
