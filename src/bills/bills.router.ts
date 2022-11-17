import * as express from 'express';
import {
    getBills,
    getBill,
    createBill,
    updateBill,
    getHistory
} from './bills.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getBills);
router.get('/history', authorization(Roles.CUSTOMER), getHistory);
router.post('/', createBill);

router.get('/:id', getBill);
router.put('/:id', authorization(Roles.CUSTOMER), updateBill)

export default router;