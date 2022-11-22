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
import { ANONYMOUS_USER } from '../core/constant';

const router = express.Router();

router.get('/', authorization(Roles.MANAGER, Roles.STAFF), getBills);
router.post('/', authorization(ANONYMOUS_USER, Roles.CUSTOMER), createBill);
router.post('/shipping', getShippingFee)
router.get('/history', authorization(Roles.CUSTOMER), getHistory);

router.put('/accept/:id', authorization(Roles.MANAGER, Roles.STAFF), acceptBill);
router.put('/ship/:id', authorization(Roles.SHIPPER), shipping)
router.get('/:id', authorization(Roles.MANAGER, Roles.STAFF, Roles.CUSTOMER), getBill);

export default router;