import { Image } from "./image";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // password: string; //should be omitted
  birthday: string;
  gender: string;
  mobileNumber: string;
  isOnline: boolean;
  datetimeCreated: string;
  image: Image;
  aboutMe: string;
  profileUrl: string;
}
