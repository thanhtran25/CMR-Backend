import * as express from 'express';
import {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from './suppliers.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getSuppliers);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createSupplier);

router.get('/:id', getSupplier);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateSupplier);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteSupplier);

export default router;