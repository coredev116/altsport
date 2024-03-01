import { Transform, TransformFnParams, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, ValidateIf } from "class-validator";

import {
  NRXLapMetadata,
  NRXLapStatus,
  // thrillOneRoundMap,
  // NRXEventCategoryType,
  // NRXRounds,
} from "../../../../constants/system";

export default class RoundScoreDto {
  @Expose({
    name: "Entry_ID",
  })
  @IsNumber()
  @IsNotEmpty()
  entryId: number;

  @Expose({
    name: "Run_ID",
  })
  @ValidateIf((_, value) => !!value)
  @IsNumber()
  @IsNotEmpty()
  runId: number;

  @Expose({
    name: "Position",
  })
  @IsNumber()
  @IsOptional()
  position: number;

  @Expose({
    name: "Battle_Position",
  })
  // has Bye to indicate if the athlete got a bye or null otherwise
  @Transform(({ value }: TransformFnParams) =>
    (value as string)?.replace(/\s+/g, " ").trim().toUpperCase(),
  )
  @IsEnum(NRXLapMetadata)
  @IsString()
  @IsOptional()
  @ValidateIf((_, value) => !!value)
  battlePosition: NRXLapMetadata | null;

  @Expose({
    name: "ResultName",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsNotEmpty()
  resultName: string;

  @Expose({
    name: "Status",
  })
  @Transform(({ value }: TransformFnParams) =>
    (value as string)?.replace(/\s+/g, " ").trim().toUpperCase(),
  )
  @IsEnum(NRXLapStatus)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object) => object.status && object.battlePosition !== NRXLapMetadata.BYE)
  status: NRXLapStatus;

  @Expose({
    name: "Laps_Total",
  })
  @ValidateIf((object) => object.status && object.status === NRXLapStatus.ACTIVE)
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object) => object.battlePosition !== NRXLapMetadata.BYE)
  lapsTotal: number;

  // @Expose({
  //   name: "Joker_inLapNR",
  // })
  // // indicates which lap the joker was on
  // @ValidateIf((value) => {
  //   // check if the round has joker round
  //   // currently TP does not, need to check other practice rounds
  //   // const resultNameSplit: string[] = value.resultName.split("_");
  //   // const applicableRound = [
  //   //   ...Object.values(thrillOneRoundMap(NRXEventCategoryType.GROUP_E, false)),
  //   //   ...Object.values(thrillOneRoundMap(NRXEventCategoryType.SUPERCAR, false)),
  //   // ].find((row) => row.heats.some((rowItem) => rowItem.resultName.includes(resultNameSplit[1])));

  //   const applicableRound = Object.values(
  //     thrillOneRoundMap(NRXEventCategoryType.GROUP_E, false),
  //   ).find((item) => {
  //     const isValid = item.roundResultNames.some((rowItem) => value.resultName.includes(rowItem));
  //     return isValid;
  //   });

  //   return value.status === NRXLapStatus.ACTIVE && ![NRXRounds.TP].includes(applicableRound?.round);
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // jokerInLapNr: number;

  @Expose({
    name: "SUM_Total",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim().replace(/-/g, ""))
  @IsString()
  @IsOptional()
  totalLapTime: string | null;

  @Expose({
    name: "LAP0",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap0: string | null;

  @Expose({
    name: "LAP1",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap1: string | null;

  @Expose({
    name: "LAP2",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap2: string | null;

  @Expose({
    name: "LAP3",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap3: string | null;

  @Expose({
    name: "LAP4",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap4: string | null;

  @Expose({
    name: "LAP5",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap5: string | null;

  @Expose({
    name: "LAP6",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsOptional()
  lap6: string | null;
}
