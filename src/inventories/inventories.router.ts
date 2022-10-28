import * as express from 'express';
import {
    getInventories,
    getInventory,
    createInventory,
    updateInventory,
} from './inventories.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getInventories);
router.post('/', createInventory);

router.get('/:id', getInventory);
router.put('/:id', updateInventory);

export default router;