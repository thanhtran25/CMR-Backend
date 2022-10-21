import { Roles } from "../../core/enum";

export interface ReqUser {
    id: number,
    email: string,
    role: Roles
}