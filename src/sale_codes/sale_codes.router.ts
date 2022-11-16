import * as express from 'express';
import {
    createSaleCode,
    getSaleCode,
    getSaleCodes,
    updateSaleCode,
    deleteSaleCode
} from './sale_codes.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getSaleCodes);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createSaleCode);

router.get('/:id', getSaleCode);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateSaleCode);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteSaleCode);

export default router;