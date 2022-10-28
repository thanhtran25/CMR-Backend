import * as express from 'express';
import {
    getInventories,
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
} from './inventories.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getInventories);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), createInventory);

router.get('/:id', getInventory);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), updateInventory);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteInventory);

export default router;