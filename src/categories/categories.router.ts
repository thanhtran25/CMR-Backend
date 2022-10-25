import * as express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from './categories.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createCategory);

router.get('/:id', authorization(Roles.MANAGER, Roles.STAFF), getCategory);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateCategory);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteCategory);

export default router;