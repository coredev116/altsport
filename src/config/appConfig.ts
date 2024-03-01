import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class AppConfig {
  static service: ConfigService;

  constructor(service: ConfigService) {
    AppConfig.service = service;
  }

  static get<T>(key: string): T {
    return AppConfig.service.get(key);
  }
}