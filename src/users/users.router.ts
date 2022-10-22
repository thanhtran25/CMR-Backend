import * as express from 'express';
import {
    createUser,
    deleteUser,
    updateUser
} from './users.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.post('/', createUser);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;