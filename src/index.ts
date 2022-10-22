import "reflect-metadata"
import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as morgan from 'morgan'
import { AppDataSource } from "./core/database";
import authRouter from "./auth/auth.router";
import userRouter from './users/users.router'
import * as resUtil from './core/utils/res.util';

async function bootstrap() {
    const port: number = parseInt(process.env.SERVER_PORT || '3004', 10);
    const app = express();

    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // Pass to next layer of middleware
        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('tiny'))

    await AppDataSource.initialize();
    console.log('Connection has been established successfully.');

    app.use('/auth', authRouter);
    app.use('/users', userRouter);

    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        return resUtil.handleError(res, error);
    });

    app.listen(port, () => {
        console.log('Listening at port: ' + port);
    })
}

bootstrap();