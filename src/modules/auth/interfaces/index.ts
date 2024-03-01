export interface IUser {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  googleUserId: string;
  providerId: string;
}
export interface ILoginResponse {
  user: IUser;
  token: string;
}
