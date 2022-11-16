import * as express from 'express';
import {
    getPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
} from './purchase_orders.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getPurchaseOrders);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createPurchaseOrder);

router.get('/:id', getPurchaseOrder);

export default router;