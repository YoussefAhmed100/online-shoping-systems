import { User } from "../schema/user.schema";

export type userResponseType=Omit< User,'password'>&{token:string}