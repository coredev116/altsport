import jsonwebtoken from "jsonwebtoken";

import * as authExceptions from "../exceptions/auth";

export const createJwtToken = <T extends object>(
  jwtAuthSecret: string,
  data: T,
  audience: string,
  issuer: string = "/auth/client",
  subject: string = "client",
  expiry: number = 300, // 5 minutes
) => {
  try {
    const token = jsonwebtoken.sign(data, jwtAuthSecret, {
      expiresIn: expiry,
      audience,
      issuer,
      subject,
    });

    return token;
  } catch (error) {
    throw error;
  }
};

export const verifyJwtToken = <T extends object>(
  jwtAuthSecret: string,
  token: string,
  options: jsonwebtoken.VerifyOptions,
) => {
  try {
    const payload = jsonwebtoken.verify(token, jwtAuthSecret, options);
    return payload as T;
  } catch (error) {
    throw authExceptions.invalidToken();
  }
};
