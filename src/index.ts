import "reflect-metadata"
import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as morgan from 'morgan'
import { AppDataSource } from "./core/database";
import usersRouter from "./users/users.router";
import * as resUtil from './core/utils/res.util';

async function bootstrap() {
    const port: number = parseInt(process.env.SERVER_PORT || '3004', 10);
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('tiny'))

    console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD);
    await AppDataSource.initialize();
    console.log('Connection has been established successfully.');

    app.use('/users', usersRouter);

    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        return resUtil.handleError(res, error);
    });

    app.listen(port, () => {
        console.log('Listening at port: ' + port);
    })
}

bootstrap();