import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { getAuth } from "firebase-admin/auth";

import * as authException from "../exceptions/auth";

import { AuthUserType } from "../constants/system";

@Injectable()
export default class AdminApiGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      if (!request.headers.authorization) throw authException.forbidden;

      const tokenList: string[] = request.headers.authorization.split(" ");
      const token: string = tokenList?.[1];

      try {
        const userData = await getAuth().verifyIdToken(token, false);
        if (userData.userType !== AuthUserType.CLIENT) throw authException.unauthorized;
        request.user = userData;
      } catch (firebaseError) {
        if (firebaseError?.response?.message === "Incorrect Usertype.")
          throw authException.unauthorized;
        throw authException.forbiddenFirebase(this.processFirebaseAuthError(firebaseError.code));
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  private processFirebaseAuthError = (errorCode: string): string => {
    const AUTH_ERROR_ID_TOKEN_REVOKED = "auth/id-token-revoked";
    const AUTH_ERROR_ID_TOKEN_EXPIRED = "auth/id-token-expired";
    const AUTH_ERROR_EMAIL_ID_ALREADY_EXISTS = "auth/email-already-exists";
    const AUTH_ERROR_INTERNAL_ERROR = "auth/internal-error";

    switch (errorCode) {
      case AUTH_ERROR_ID_TOKEN_REVOKED:
        return "Token has been revoked, please re-authenticate";

      case AUTH_ERROR_ID_TOKEN_EXPIRED:
        return "Token has expired, please re-authenticate";

      case AUTH_ERROR_EMAIL_ID_ALREADY_EXISTS:
        return "Email ID already exists";

      case AUTH_ERROR_INTERNAL_ERROR:
      default:
        return "Unable to authenticate user";
    }
  };
}
