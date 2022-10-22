import { ReqUser } from "../../users/interfaces/user.interface";

declare global {
    namespace Express {
        interface Request {
            user?: ReqUser;
        }
    }
}