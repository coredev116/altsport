import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class IExactasParticipantsDto {
  @ApiProperty({
    name: "firstName",
    type: "string",
    required: true,
    example: "Mark",
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    name: "middleName",
    type: "string",
    required: false,
    example: "Mark",
  })
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({
    name: "lastName",
    type: "string",
    required: true,
    example: "Brown",
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  eventParticipantId: string;
}

export class CreateExactasDto {
  @ApiProperty({
    name: "roundHeatId",
    type: "string",
    required: false,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsOptional()
  roundHeatId: string;

  @ApiProperty({
    name: "participants",
    type: "json",
    example: `
        [
            {
            "firstName": "Athlete name",
            "lastName": "Athlete name",
            "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
            }
        ]
    `,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IExactasParticipantsDto)
  participants: IExactasParticipantsDto[];
}
