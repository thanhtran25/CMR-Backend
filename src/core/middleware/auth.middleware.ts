import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Unauthorized, Forbidden } from 'http-errors';
import { ReqUser } from '../../users/interfaces/user.interface';

export function authorization(...roles: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;
            if (!token || !token.startsWith('Bearer')) {
                throw new Unauthorized('Token schema is invalid or missing');
            };

            const accessToken = token.replace('Bearer ', '');

            const user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: false }) as ReqUser;

            console.log(user.role);


            if (roles.length && !roles.some((role) => role === user.role)) {
                throw new Forbidden('Forbidden accessible');
            }

            req.user = user;
            next()

        } catch (error) {
            const err = new Unauthorized(error.message)
            next(err)
        }
    }
}