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
router.post('/', authorization(), createBranch);

router.get('/:id', authorization(), getBranch);
router.put('/:id', authorization(), updateBranch);
router.delete('/:id', authorization(), deleteBranch);

export default router;