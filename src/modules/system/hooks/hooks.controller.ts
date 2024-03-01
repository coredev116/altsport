import { Controller, Post, Req, HttpStatus, HttpCode } from "@nestjs/common";
import { Request } from "express";
import { validateOrReject, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

import {
  SportsTypes,
  thrillOneRoundMap,
  NRXResultsCategoryType,
  NRXEventCategoryType,
  NRXLapStatus,
} from "../../../constants/system";

import SlackService from "../../../services/slack.service";
import HooksService from "../hooks/hooks.service";

import * as systemException from "../../../exceptions/system";

const VALID_ROUND_NAMES = [
  ...Object.values(thrillOneRoundMap(NRXEventCategoryType.GROUP_E, false))
    // .map((row) => row.heats.map((heatRow) => heatRow.name))
    .map((row) => row.roundResultNames)
    .flat(2),
  // ...Object.values(thrillOneRoundMap(NRXEventCategoryType.SUPERCAR, false))
  //   .map((row) => row.heats.map((heatRow) => heatRow.resultName))
  //   .flat(2),
];

import EventsDto from "./dto/events.dto";
import RoundScoreDto from "./dto/roundScore.dto";
import BracketRoundScoreDto from "./dto/bracketRoundScore.dto";
import EventParticipantsDto from "./dto/eventParticipants.dto";
import ActiveEventSessionDto from "./dto/activeEventSession.dto";
// import RoundGridDto from "./dto/roundGrid.dto";
// import BracketRoundGridDto from "./dto/bracketRoundGrid.dto";

@Controller({
  path: "hooks",
})
export default class HooksController {
  constructor(
    private readonly slackService: SlackService,
    private readonly hooksService: HooksService,
  ) {}

  @Post(`${SportsTypes.RALLYCROSS}/event`)
  @HttpCode(HttpStatus.OK)
  async create(@Req() request: Request) {
    try {
      const payload = {
        message: "Received",
        body: request.body,
        method: request.method,
        url: request.url,
      };

      // await this.slackService.dumpLog({
      //   title: "Hook Event",
      //   payload: {
      //     message: "Received",
      //     method: request.method,
      //     url: request.url,
      //   },
      // });

      // eslint-disable-next-line no-console
      console.log("event-payload: ", JSON.stringify(request.body));

      if (!payload.body || !payload.body?.length) {
        await this.slackService.dumpLog({
          title: "Hook Event Unable to process",
          payload: null,
        });

        throw systemException.thrillOneUnprocessableEntity();
      }

      if (Array.isArray(payload.body)) {
        const item = payload.body[0];

        // itenerary & schedule update
        if ("Display_Name" in item) {
          const parsedData = payload.body.map((row) => ({
            ...row,
            runId: row.run_ID || row.Run_ID,
            status: row.Status || row.statusname,
          }));

          const data: EventsDto[] = plainToInstance(EventsDto, parsedData, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
          });
          await this.sanitizeInput(data);

          const categoryFilteredData = data.filter((row) =>
            // [NRXEventCategoryType.GROUP_E, NRXEventCategoryType.SUPERCAR].includes(
            [NRXEventCategoryType.GROUP_E].includes(row.categoryName),
          );

          await this.hooksService.setupEvent(categoryFilteredData);
        } else if ("ResultName" in item) {
          if (
            item.ResultName.includes("_startlist_") &&
            !item.ResultName.includes("_startlist_teams")
          ) {
            // participant list update
            const data = plainToInstance(EventParticipantsDto, payload.body, {
              enableImplicitConversion: true,
              excludeExtraneousValues: true,
            });

            await this.sanitizeInput(data);

            await this.hooksService.setupEventParticipants(data);
          } else if (
            VALID_ROUND_NAMES.some((roundName) => {
              // const thrillRoundName = item.ResultName.split("_")[1];

              const isValid = item.ResultName.includes(roundName);
              return isValid;
            })
          ) {
            if (item.ResultName.includes("bracket")) {
              const data = plainToInstance(BracketRoundScoreDto, payload.body, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
              });

              await this.sanitizeInput(data);

              const rowTtem = data[0];

              // bracket round seems to have a max of 3
              const lapsTotal = 3;

              const resultNameSplit: string[] = rowTtem.resultName.split("_");
              const eventCategory: NRXEventCategoryType = Object.values(
                NRXResultsCategoryType,
              ).find((row) => row.name === resultNameSplit[0]).eventCategory;
              const roundNos: number[] = Object.values(thrillOneRoundMap(eventCategory, false))
                .filter((row) =>
                  row.heats.some((rowItem) => rowItem.resultName.includes(resultNameSplit[1])),
                )
                .map((row) => row.round);

              await this.hooksService.logAthleteBracketTime(
                data,
                eventCategory,
                roundNos,
                lapsTotal,
              );
            } else {
              // athlete log time update
              const data = plainToInstance(RoundScoreDto, payload.body, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
              });

              await this.sanitizeInput(data);

              // thrill one no longer sends the run id for certain rows so find a row that has runId and assign it to the rest
              const rowWithRunId = data.find((itemRow) => itemRow.runId);
              const parsedRows = data.map((row) => ({
                ...row,
                runId: rowWithRunId.runId,
              }));

              const rowTtem = parsedRows.find((row) => row.status === NRXLapStatus.ACTIVE);
              if (!rowTtem) throw systemException.validationError("Invalid Payload");

              // find max laps
              const lapsTotal = Math.max(
                ...parsedRows
                  .filter((row) => row.status === NRXLapStatus.ACTIVE)
                  .map((row) => row.lapsTotal),
              );

              const resultNameSplit: string[] = rowTtem.resultName.split("_");
              const eventCategory: NRXEventCategoryType = Object.values(
                NRXResultsCategoryType,
              ).find((row) => row.name === resultNameSplit[0])?.eventCategory;

              // thrill one doesn't always send the right category
              // so in case it doesn't match, rejecct everything else
              if (!eventCategory) return "OK";

              // const roundNos: number[] = Object.values(thrillOneRoundMap(eventCategory, false))
              //   .filter((row) =>
              //     row.heats.some((rowItem) => rowItem.resultName.includes(resultNameSplit[1])),
              //   )
              //   .map((row) => row.round);
              const roundNos: number[] = Object.values(
                thrillOneRoundMap(NRXEventCategoryType.GROUP_E, false),
              )
                .filter((itemRow) => {
                  const isValid = itemRow.roundResultNames.some((rowItem) =>
                    rowTtem.resultName.includes(rowItem),
                  );
                  return isValid;
                })
                .map((row) => row.round);

              await this.hooksService.logAthleteLapTime(
                parsedRows,
                eventCategory,
                roundNos,
                lapsTotal,
              );
            }
          }
        } else if ("Result_Name" in item) {
          // if (item.Result_Name.includes("Bracket_Grid")) {
          //   // bracket grid
          //   const data = plainToInstance(BracketRoundGridDto, payload.body, {
          //     enableImplicitConversion: true,
          //     excludeExtraneousValues: true,
          //   });
          //   await this.sanitizeInput(data);
          //   // TODO: add functionality for bracket grid
          // } else if (item.Result_Name.includes("Grid")) {
          //   // normal round grid
          //   const data = plainToInstance(RoundGridDto, payload.body, {
          //     enableImplicitConversion: true,
          //     excludeExtraneousValues: true,
          //   });
          //   await this.sanitizeInput(data);
          //   // TODO: add functionality for round grid
          // }
        } else {
          // nothing to process
          throw systemException.thrillOneUnprocessableEntity();
        }
      }

      return "OK";
    } catch (error) {
      await this.slackService.dumpLog({
        title: "Hook Event Unable to process main error",
        payload: null,
        stack: error,
      });
      // FIXME: not throwing an exception temporarily to prevent Thrill One from halting api
      return "OK";
      // throw error;
    }
  }

  @Post(`${SportsTypes.RALLYCROSS}/event/jtime`)
  @HttpCode(HttpStatus.OK)
  async logJTime(@Req() request: Request) {
    try {
      const bodyPayload = request.body;

      if ("DATA" in bodyPayload && bodyPayload.DATA !== "ActiveSession") {
        // intentionally marking this as OK because we do not consume it now
        return "OK";
      }

      // eslint-disable-next-line no-console
      console.log("jtime-payload: ", JSON.stringify(request.body));

      const payload = {
        message: "Received",
        body: request.body,
        method: request.method,
        url: request.url,
      };

      // await this.slackService.dumpLog({
      //   title: "Hook JTime Event",
      //   payload,
      // });

      const data: ActiveEventSessionDto = plainToInstance(ActiveEventSessionDto, payload.body, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      });
      await this.sanitizeInput([data]);

      // if (data.state === "Active" && data.eventType === "ActiveSession")
      //   await this.hooksService.activeEventSessionUpdate(data);

      return "OK";
    } catch (error) {
      throw error;
    }
  }

  private async sanitizeInput(payload: object[]) {
    try {
      const validationPromises = payload.map(async (row) => {
        try {
          await validateOrReject(row, {
            stopAtFirstError: true,
          });
        } catch (error) {
          const customError: ValidationError[] = error;

          // find the firsr error;
          const errorKey: string = customError[0]?.constraints
            ? Object.keys(customError[0]?.constraints)[0]
            : null;

          const objError: string = errorKey ? customError[0]?.constraints[errorKey] : null;

          throw systemException.validationError(
            "Warning",
            { error: objError, item: row },
            HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          );
        }
      });
      await Promise.all(validationPromises);

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        "🚀 ~ file: hooks.controller.ts ~ line 157 ~ HooksController ~ sanitizeInput ~ error",
        error,
      );
      await this.slackService.dumpLog({
        title: "Invalid Hook Payload",
        payload: {},
        stack: error,
      });

      throw error;
    }
  }
}
