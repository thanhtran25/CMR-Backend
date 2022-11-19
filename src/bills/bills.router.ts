import * as express from 'express';
import {
    getBills,
    getBill,
    createBill,
    acceptBill,
    getHistory,
    getShippingFee,
    shipping
} from './bills.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', authorization(Roles.MANAGER, Roles.STAFF), getBills);
router.get('/history', authorization(Roles.CUSTOMER), getHistory);
router.post('/', createBill);

router.get('/:id', authorization(Roles.MANAGER, Roles.STAFF, Roles.CUSTOMER), getBill);
router.put('/accept/:id', authorization(Roles.MANAGER, Roles.STAFF), acceptBill);
router.put('/ship/:id', authorization(Roles.SHIPPER), shipping)

router.post('/shipping', getShippingFee)

export default router;