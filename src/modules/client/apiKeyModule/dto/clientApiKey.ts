import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform, TransformFnParams } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";

class ClientApiKeyItemDto {
  @ApiProperty({ name: "apiKey", type: "string", required: true, example: "fdfdfd545ddff" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  apiKey: string;

  @ApiProperty({
    name: "clientId",
    type: "string",
    required: true,
    example: "f23cacbe-3c2c-4ea5-8084-09e975849bd9",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  clientId: string;

  @ApiProperty({
    name: "expiryDate",
    type: "string",
    required: true,
    example: "2022-05-18T11:39:07.603Z",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  expiryDate: string;
}

export class ClientApiKeyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientApiKeyItemDto)
  @ApiProperty({ name: "items", type: ClientApiKeyItemDto, required: true, isArray: true })
  items: ClientApiKeyItemDto[];
}

export class Client {
  @ApiProperty({ name: "id", type: "string", example: "9mRnwDdKchfgCSPalLFRwB2v6e2MFkbO" })
  id: string;

  @ApiProperty({ name: "username", type: "string", example: "john_mckay" })
  username: string;
}

export class ClientApiKeyListingItemDto {
  @ApiProperty({ name: "totalRequestCount", type: "number", example: 1 })
  totalRequestCount: number;

  @ApiProperty({ name: "currentRequestCount", type: "number", example: 1 })
  currentRequestCount: number;

  @ApiProperty({ name: "apiKey", type: "string", example: "9mRnwDdKchfgCSPalLFRwB2v6e2MFkbO" })
  apiKey: string;

  @ApiProperty({
    name: "expiryDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  expiryDate: Date;

  @ApiProperty({
    type: Client,
  })
  client: Client;
}

export class ClientApiKeyListingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientApiKeyItemDto)
  @ApiProperty({ name: "items", type: ClientApiKeyItemDto, required: true, isArray: true })
  items: ClientApiKeyListingItemDto[];
}
