import * as express from 'express';
import {
    getPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
} from './purchase_orders.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', authorization(Roles.MANAGER, Roles.STAFF), getPurchaseOrders);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createPurchaseOrder);

router.get('/:id', authorization(Roles.MANAGER, Roles.STAFF), getPurchaseOrder);

export default router;