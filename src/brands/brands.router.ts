import * as express from 'express';
import {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
} from './brands.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getBrands);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createBrand);

router.get('/:id', getBrand);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateBrand);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteBrand);

export default router;