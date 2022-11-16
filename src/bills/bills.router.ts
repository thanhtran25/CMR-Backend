import * as express from 'express';
import {
    getBills,
    getBill,
    createBill,
    updateBill,
} from './bills.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getBills);
router.post('/', createBill);

router.get('/:id', getBill);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateBill)

export default router;