import "reflect-metadata"
import * as dotenv from "dotenv";
import * as cors from "cors";
dotenv.config();

import * as express from "express";
import * as morgan from 'morgan'
import { AppDataSource } from "./core/database";
import authRouter from "./auth/auth.router";
import userRouter from './users/users.router';
import categoryRouter from './categories/categories.router';
import brandRouter from './brands/brands.router';
import inventoryRouter from './inventories/inventories.router;'
import * as resUtil from './core/utils/res.util';

async function bootstrap() {
    const port: number = parseInt(process.env.SERVER_PORT || '3004', 10);
    const app = express();

    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('tiny'))

    await AppDataSource.initialize();
    console.log('Connection has been established successfully.');

    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/categories', categoryRouter);
    app.use('/brands', brandRouter);
    app.use('/inventories', inventoryRouter);

    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        return resUtil.handleError(res, error);
    });

    app.listen(port, () => {
        console.log('Listening at port: ' + port);
    })
}

bootstrap();