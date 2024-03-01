import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json } from "express";
import * as admin from "firebase-admin";
import fs from "fs";
import helmet from "helmet";
import { ParseResultType, fromUrl, parseDomain } from "parse-domain";
import { AppModule } from "./app.module";

import AuthModule from "./modules/auth/auth.module";

import AdminManagementModule from "./modules/admin/admin.module";
import F1AdminModule from "./modules/f1/admin/admin.module";
import FDRIFTAdminModule from "./modules/fdrift/admin/admin.module";
import FuturesAdminModule from "./modules/futures/admin/admin.module";
import JAAdminModule from "./modules/ja/admin/admin.module";
import MASLAdminModule from "./modules/masl/admin/admin.module";
import MGAdminModule from "./modules/mg/admin/admin.module";
import MOTOCRSAdminModule from "./modules/motocrs/admin/admin.module";
import MXGPAdminModule from "./modules/mxgp/admin/admin.module";
import NRXAdminModule from "./modules/nrx/admin/admin.module";
import OddsAdminModule from "./modules/odds/admin/admin.module";
import OddsClientModule from "./modules/odds/client/client.module";
import PBRAdminModule from "./modules/pbr/admin/admin.module";
import AdminSportsModule from "./modules/sports/admin/sports.module";
import SPRAdminModule from "./modules/spr/admin/admin.module";
import WSLAdminModule from "./modules/wsl/admin/admin.module";

// import PublicSportsModule from "./modules/sports/public/sports.module";
import MOTOCRSPublicModule from "./modules/motocrs/public/public.module";
import NRXPublicModule from "./modules/nrx/public/public.module";
import PublicModule from "./modules/public/public.module";
import SLSAdminModule from "./modules/sls/admin/admin.module";
import SLSPublicModule from "./modules/sls/public/public.module";
import SPRPublicModule from "./modules/spr/public/public.module";
import WSLPublicModule from "./modules/wsl/public/public.module";

import ClientModule from "./modules/client/client.module";
import F1ClientModule from "./modules/client/f1/f1.module";
import FDriftClientModule from "./modules/client/fdrift/fdrift.module";
import JAClientModule from "./modules/client/ja/ja.module";
import MASLClientModule from "./modules/client/masl/masl.module";
import MGClientModule from "./modules/client/mg/mg.module";
import MotocrsClientModule from "./modules/client/motocrs/motocrs.module";
import MXGPClientModule from "./modules/client/mxgp/mxgp.module";
import NRXClientModule from "./modules/client/nrx/nrx.module";
import ClientSettingsModule from "./modules/client/settings/settings.module";
import SLSClientModule from "./modules/client/sls/sls.module";
import SPRClientModule from "./modules/client/spr/spr.module";
import WSLClientModule from "./modules/client/wsl/wsl.module";
import FuturesClientModule from "./modules/futures/client/client.module";

import { PUBLIC_API_KEY_HEADER } from "./constants/auth";
import { SportNames, SportsTypes } from "./constants/system";

import * as systemExceptions from "./exceptions/system";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    logger: ["error", "warn", "debug", "log"],
  });
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const isRelease: boolean = configService.get("isRelease");

  const commonWhitelistedDomains = ["nxtbets.com", "altsportsdata.com"];

  const whitelist = !isRelease
    ? [...commonWhitelistedDomains, "localhost"]
    : [...commonWhitelistedDomains];

  app.enableCors({
    maxAge: 604800, // 1 week
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      try {
        const domainConfig = parseDomain(fromUrl(origin));

        if (domainConfig.type === ParseResultType.Listed) {
          const { domain, topLevelDomains } = domainConfig;
          const originDomain = `${domain}.${topLevelDomains}`;

          if (whitelist.includes(originDomain)) {
            callback(null, true);
            return;
          }
        } else if (domainConfig.type === ParseResultType.Reserved) {
          // localhost
          const { hostname } = domainConfig;
          if (whitelist.includes(hostname)) {
            callback(null, true);
            return;
          }
        }

        callback(systemExceptions.corsError);
        return;
      } catch (error) {
        console.error("CORS error => origin = ", origin);
      }
    },
  });

  app.use(
    helmet({
      hidePoweredBy: true,
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false, // this is to allow redoc
    }),
  );

  app.setGlobalPrefix("api");
  app.use(json({ limit: "25mb" }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  admin.initializeApp({
    credential: admin.credential.cert(configService.get("firebase")),
  });

  const port = configService.get<number>("APP_PORT");

  // admin api documentation
  const adminConfig = new DocumentBuilder()
    .setTitle("Admin API")
    .setDescription("Admin api documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [
      AdminSportsModule,
      AuthModule,
      AdminManagementModule,
      FuturesAdminModule,
      OddsAdminModule,
    ],
    deepScanRoutes: true,
  });

  Object.keys(SportsTypes).map((key) => {
    const name: string = SportNames[SportsTypes[key]];
    const value: SportsTypes = SportsTypes[key];

    const sportConfig = new DocumentBuilder()
      .setTitle(`Admin ${name} API`)
      .setDescription(`Admin ${name} API Documentation`)
      .setVersion("1.0")
      .addBearerAuth()
      .setDescription(`Base URL: /api/v1/admin/${value}`)
      .build();

    const modules = [];

    switch (value) {
      case SportsTypes.SURFING:
        modules.push(WSLAdminModule);
        break;

      case SportsTypes.SKATEBOARDING:
        modules.push(SLSAdminModule);
        break;

      case SportsTypes.RALLYCROSS:
        modules.push(NRXAdminModule);
        break;

      case SportsTypes.SUPERCROSS:
        modules.push(SPRAdminModule);
        break;

      case SportsTypes.MOTOCROSS:
        modules.push(MOTOCRSAdminModule);
        break;

      case SportsTypes.FDRIFT:
        modules.push(FDRIFTAdminModule);
        break;

      case SportsTypes.MotoGP:
        modules.push(MGAdminModule);
        break;

      case SportsTypes.MASL:
        modules.push(MASLAdminModule);
        break;

      case SportsTypes.JA:
        modules.push(JAAdminModule);
        break;

      case SportsTypes.PBR:
        modules.push(PBRAdminModule);
        break;

      case SportsTypes.F1:
        modules.push(F1AdminModule);
        break;

      case SportsTypes.MXGP:
        modules.push(MXGPAdminModule);
        break;

      default:
        break;
    }

    if (!modules.length) return false;

    const sportDocument = SwaggerModule.createDocument(app, sportConfig, {
      include: modules,
      deepScanRoutes: true,
    });

    SwaggerModule.setup(`admin/doc/${value}`, app, sportDocument, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
    });
  });

  SwaggerModule.setup("admin/doc", app, adminDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  // client api documentation
  const clientConfig = new DocumentBuilder()
    .setTitle("Client API")
    .setDescription("Client api documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const clientDocument = SwaggerModule.createDocument(app, clientConfig, {
    include: [
      ClientModule,
      WSLClientModule,
      SLSClientModule,
      NRXClientModule,
      SPRClientModule,
      FDriftClientModule,
      MGClientModule,
      MotocrsClientModule,
      F1ClientModule,
      MXGPClientModule,
      MASLClientModule,
      JAClientModule,
      FuturesClientModule,
      ClientSettingsModule,
      OddsClientModule,
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup(`client/docs`, app, clientDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  // public api documentation
  const publicConfig = new DocumentBuilder()
    .setTitle("Public API")
    .setDescription("Public api documentation")
    .setVersion("1.0")
    .addApiKey({ type: "apiKey", name: PUBLIC_API_KEY_HEADER, in: "header" }, PUBLIC_API_KEY_HEADER)
    .build();
  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    // include: [PublicSportsModule, PublicModule],
    include: [PublicModule],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(`public/docs/swagger`, app, publicDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  Object.keys(SportsTypes).map((key) => {
    const name: string = SportNames[SportsTypes[key]];
    const value: SportsTypes = SportsTypes[key];

    const sportConfig = new DocumentBuilder()
      .setTitle(`Public ${name} API`)
      .setDescription(`Public ${name} API Documentation`)
      .setVersion("1.0")
      .addApiKey(
        { type: "apiKey", name: PUBLIC_API_KEY_HEADER, in: "header" },
        PUBLIC_API_KEY_HEADER,
      )
      .build();

    const modules = [];

    switch (value) {
      case SportsTypes.SURFING:
        modules.push(WSLPublicModule);
        break;

      case SportsTypes.SKATEBOARDING:
        modules.push(SLSPublicModule);
        break;

      case SportsTypes.RALLYCROSS:
        modules.push(NRXPublicModule);
        break;

      case SportsTypes.SUPERCROSS:
        modules.push(SPRPublicModule);
        break;

      case SportsTypes.MOTOCROSS:
        modules.push(MOTOCRSPublicModule);
        break;

      default:
        break;
    }

    if (!modules.length) return false;

    const sportDocument = SwaggerModule.createDocument(app, sportConfig, {
      include: modules,
      deepScanRoutes: true,
    });

    SwaggerModule.setup(`public/docs/${value}/swagger`, app, sportDocument, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
    });

    fs.writeFileSync(
      `src/docs/public/docs/${value}/swagger-spec.${value}.json`,
      JSON.stringify(sportDocument),
    );
  });

  fs.writeFileSync("src/docs/public/docs/swagger-spec.json", JSON.stringify(publicDocument));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port);
}
export default bootstrap();
