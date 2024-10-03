import { User } from "next-auth"


export interface Authenticateduser extends User {
    accessToken : string,
    refreshToken : string
}