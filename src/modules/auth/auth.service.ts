import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Equal } from "typeorm";

import Clients from "../../entities/clients.entity";
import Users from "../../entities/users.entity";

import { LoginDto, UpdateUserDto } from "./dto/auth.dto";

import * as authExceptions from "../../exceptions/auth";

import { GetUserResponse } from "./schemas/response";

import { UserTypes } from "../../constants/system";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  //   async createClient(): Promise<Clients> {
  //     try {
  //       let clientT = {
  //         email: "reddyganesh15101@gmail.com",
  //         username: "reddyganesh1",
  //         password: await argon2.hash("demopassword"),
  //         firstName: "Ganesh",
  //         lastName: "Reddy",
  //         googleUserId: "tseat",
  //         providerId: "test1",
  //       };
  //       const client = this.clientRepository.create(clientT);
  //       await this.clientRepository.save(client);

  //       let firebaseUser = await getAuth().createUser(clientT);

  //       return client;
  //     } catch (error) {

  //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }

  public async getClient(body: LoginDto): Promise<Clients> {
    try {
      const client = await this.clientRepository
        .createQueryBuilder("client")
        .where({
          isActive: true,
          isArchived: false,
          username: Equal(body.username),
        })
        .getOne();
      return client;
    } catch (error) {}
  }

  public async getUser(body: LoginDto): Promise<Users> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .where({
          isActive: true,
          isArchived: false,
          username: Equal(body.username),
        })
        .getOne();
      return user;
    } catch (error) {}
  }

  public async getUserById(userId: string): Promise<GetUserResponse> {
    try {
      const userData: Users = await this.userRepository
        .createQueryBuilder("user")
        .where({
          isActive: true,
          isArchived: false,
          id: Equal(userId),
        })
        .getOne();
      if (!userData) throw authExceptions.unauthorized;

      const { id, firstName, middleName, lastName, email, username, phone, country, userType } =
        userData;

      const displayRole: string = userType === UserTypes.ADMIN ? "Super Admin" : "Trader";

      const user = {
        id,
        firstName,
        middleName,
        lastName,
        email,
        username,
        phone: phone || null,
        country,
        displayRole,
        userType: "admin",
      };

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserById(
    userId: string,
    userType: string,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserResponse> {
    let userData = null;
    if (userType === "client") {
      userData = await this.clientRepository
        .createQueryBuilder("user")
        .where({
          isActive: true,
          isArchived: false,
          id: Equal(userId),
        })
        .getOne();
      return this.clientRepository.save({
        ...userData, // existing fields
        ...updateUserDto, // updated fields
      });
    } else {
      userData = await this.userRepository
        .createQueryBuilder("user")
        .where({
          isActive: true,
          isArchived: false,
          id: Equal(userId),
        })
        .getOne();

      return this.userRepository.save({
        ...userData, // existing fields
        ...updateUserDto, // updated fields
      });
    }
  }
}
