import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ReqUser } from '../../users/interfaces/user.interface';

export function userSignin(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer')) {
            return null;
        };

        const accessToken = token.replace('Bearer ', '');

        const user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: false }) as ReqUser;
        return user;

    } catch (error) {
        next(error);
    }
}