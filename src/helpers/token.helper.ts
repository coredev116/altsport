import { Request } from "express";
import { getAuth } from "firebase-admin/auth";

const extractToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")?.[0] === "Bearer") {
    return req.headers.authorization.split(" ")?.[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const verifyAccessToken = async (token: string) => {
  const decodedToken = await getAuth().verifyIdToken(token);

  return decodedToken;
};

export { extractToken, verifyAccessToken };
