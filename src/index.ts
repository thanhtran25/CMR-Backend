import "reflect-metadata"
import * as fs from "fs/promises";
import * as path from "path";
import * as dotenv from "dotenv";
import * as cors from "cors";
dotenv.config();

import * as express from "express";
import * as morgan from 'morgan';
import { NotFound } from 'http-errors';
import { AppDataSource } from "./core/database";
import authRouter from "./auth/auth.router";
import userRouter from './users/users.router';
import categoryRouter from './categories/categories.router';
import brandRouter from './brands/brands.router';
import inventoryRouter from './inventories/inventories.router';
import productRouter from './products/products.router';
import supplierRouter from './suppliers/suppliers.router';
import purchaseOrderRouter from './purchase_orders/purchase_orders.router';
import saleCodeRouter from './sale_codes/sale_codes.router';
import * as resUtil from './core/utils/res.util';

async function bootstrap() {
    const port: number = parseInt(process.env.SERVER_PORT || '3004', 10);
    const app = express();

    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static(path.join(__dirname, '..', 'public')));
    app.use(morgan('tiny'));

    await AppDataSource.initialize();
    console.log('Connection has been established successfully.');

    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/categories', categoryRouter);
    app.use('/brands', brandRouter);
    app.use('/inventories', inventoryRouter);
    app.use('/products', productRouter);
    app.use('/suppliers', supplierRouter);
    app.use('/purchase-orders', purchaseOrderRouter);
    app.use('/sale-codes', saleCodeRouter);

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        return next(new NotFound('Route not found'))
    });

    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.file) {
            fs.unlink(req.file.path).catch(error => console.log(error))
        } else if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                fs.unlink(file.path).catch(error => console.log(error))
            }
        }

        return resUtil.handleError(res, error);
    });

    app.listen(port, () => {
        console.log('Listening at port: ' + port);
    })
}

bootstrap();