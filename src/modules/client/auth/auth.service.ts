import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Equal, EntityManager } from "typeorm";
import * as argon2 from "argon2";
import { getAuth } from "firebase-admin/auth";

import Clients from "../../../entities/clients.entity";

import ClientMarketNotifications from "../../../entities/clientMarketNotifications.entity";
import OddMarkets from "../../../entities/oddMarkets.entity";

import { CreateClientDto } from "./dto/auth.dto";
import { OnboardDto } from "./dto/onboard.dto";

import { GetClientResponse } from "./schemas/response";

import * as authExceptions from "../../../exceptions/auth";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,

    @InjectRepository(ClientMarketNotifications)
    private readonly clientMarketNotificationsRepository: Repository<ClientMarketNotifications>,
  ) {}

  public async createClient(body: CreateClientDto): Promise<Clients> {
    try {
      const result = await this.clientRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          let firebaseUser;
          try {
            firebaseUser = await getAuth().createUser({
              displayName: `${body.firstName} ${body.lastName}`,
              password: body.password,
              email: body.companyEmail,
              emailVerified: true,
            });

            const client = this.clientRepository.create({
              email: body.companyEmail,
              username: body.companyEmail,
              password: await argon2.hash(body.password),
              firstName: body.firstName,
              lastName: body.lastName,
              googleUserId: firebaseUser.uid,
              providerId: "email",
              companyName: body.companyName,
              phone: body.phone,
            });
            await transactionalEntityManager.save(client);

            return client;
          } catch (error) {
            if (firebaseUser && firebaseUser.uid) {
              await getAuth().deleteUser(firebaseUser.uid);
            }
            throw error;
          }
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getClient(username: string): Promise<Clients> {
    try {
      const client = await this.clientRepository
        .createQueryBuilder("client")
        .where({
          isActive: true,
          isArchived: false,
          username: Equal(username),
        })
        .getOne();
      return client;
    } catch (error) {
      throw error;
    }
  }

  public async getClientById(clientId: string): Promise<GetClientResponse> {
    try {
      const userData: Clients = await this.clientRepository.findOne({
        where: {
          id: clientId,
        },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          username: true,
          phone: true,
          country: true,
        },
      });
      if (!userData) throw authExceptions.clientNotFound;

      const { id, firstName, middleName, lastName, email, username, phone, country } = userData;

      const marketNotifications = await this.clientMarketNotificationsRepository.find({
        where: {
          clientId: id,
        },
        select: {
          id: true,
          sms: true,
          email: true,
          slack: true,
          clientId: true,
          market: {
            id: true,
            name: true,
            key: true,
          },
        },
        relations: ["market"],
      });

      const displayRole: string = "Client";

      const user = {
        id,
        firstName,
        companyEmail: email,
        middleName,
        lastName,
        email,
        username,
        phone: phone || null,
        country,
        displayRole,
        userType: "client",
        notificationMarkets: marketNotifications
          .filter((row) => row.sms || row.email || row.slack)
          .map((row) => ({
            id: row.market.id,
            name: row.market.name,
            key: row.market.key,
          })),
      };

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async verifyPhoneNumber(clientId: string): Promise<boolean> {
    try {
      await this.clientRepository.update(
        {
          id: clientId,
        },
        {
          isPhoneVerified: true,
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async onboardClient(clientId: string, body: OnboardDto): Promise<boolean> {
    try {
      const result = await this.clientRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          try {
            const oddMarkets = await transactionalEntityManager.find(OddMarkets, {
              where: {
                isActive: true,
                isArchived: false,
              },
              select: {
                id: true,
              },
            });

            await transactionalEntityManager.update(
              Clients,
              {
                id: clientId,
              },
              {
                password: await argon2.hash(body.password),
                hasOnboarded: true,
              },
            );

            const marketNotifications: ClientMarketNotifications[] = oddMarkets.map((row) =>
              this.clientMarketNotificationsRepository.create({
                clientId,
                oddMarketId: row.id,
                sms: body.isSmsNotificationEnabled,
                email: body.isEmailNotificationEnabled,
              }),
            );

            await transactionalEntityManager.insert(ClientMarketNotifications, marketNotifications);

            return true;
          } catch (err) {
            throw err;
          }
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
