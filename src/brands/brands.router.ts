import * as express from 'express';
import {
    getBrands,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
} from './brands.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getBrands);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createBranch);

router.get('/:id', authorization(Roles.MANAGER, Roles.STAFF), getBranch);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateBranch);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteBranch);

export default router;