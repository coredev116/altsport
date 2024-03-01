import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class EventListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "nrx:2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "Unique ID related to the contest.",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "Billabong Pro Pipeline",
    description: "The name of the contest, which may not be unique.",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "tourName",
    type: "string",
    example: "World Surf League",
    description:
      "The name of the tour or league that is hosting the contest (tour is a general sub-category within a sports league, and may not necessarily apply directly to a tour as defined by the official association).",
  })
  @IsString()
  tourName: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-01-29T13:00:00Z",
    description: "The expected start date for the contest.",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-02-10T19:00:00Z",
    description: "The expected end date for the contest.",
  })
  endDate: Date;

  @ApiProperty({
    name: "year",
    type: "number",
    example: 2022,
    description:
      "The year in which the season of the contest started (for seasons that span more than a single calendar year, we use only the first year to apply for each contest - for example, if the 2021 Nitrocross season concludes in 2022, the year applied to a contest held in March of 2022 will be 2021, while the endDate will be in 2022).",
  })
  year: number;

  @ApiProperty({
    name: "eventNumber",
    type: "number",
    example: 1,
    description:
      "The sequential number of the event within the season for that league and year - for example, the first contest of a season will show an eventNumber of 1.",
  })
  eventNumber: number;

  @ApiProperty({
    name: "eventStatus",
    type: "string",
    example: "COMPLETED",
    description:
      "The status of the contest, to indicate if it is scheduled and upcoming, live, completed, canceled or postponed.",
  })
  eventStatus: string;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    example: "Margaret River",
    description:
      "The geographical location of the contest to the best standardization possible - for example, while we can format contest locations for the United States as City, State, USA, it is not always the same format internationally and we may adapt these formats as necessary.",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Margaret River Group",
    description:
      "(Applies to World Surf League only) This is similar to eventLocation, but denotes a contest lineage that may be held at different geographical locations - for example, the Gold Coast Pro is typically held at Kirra Beach in Coolangatta, Queensland, Australia. However, due to surf conditions, it may be held at another beach in the neighboring city of Tweed Heads, Queensland, Australia. As such, eventLocationGroup will still be the same for both contests, while the eventLocation will be different.",
  })
  eventLocationGroup: string;
}
