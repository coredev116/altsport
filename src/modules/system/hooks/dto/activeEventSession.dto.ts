import { Transform, TransformFnParams, Expose } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";
import { parse } from "date-fns";

export default class ActiveEventSessionDto {
  @Expose({
    name: "DATA",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  eventType: string;

  @Expose({
    name: "Name",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({
    name: "PlannedStart",
  })
  // dividing by this number because the provider sends the value in nanoseconds
  @Transform(({ value }: TransformFnParams) => {
    const val = +value > 0 ? +value / 1_000_000 : 0;
    if (!val) return val;

    return parse(`${val}`, "t", new Date()).toISOString();
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @Expose({
    name: "State",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  state: string;

  @Expose({
    name: "ID",
  })
  @IsNotEmpty()
  @IsString()
  providerRunId: string;
}
