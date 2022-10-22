import * as express from 'express';
import {
    createUser,
    updateUser
} from './users.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.post('/', createUser);
router.put('/:id', updateUser);

export default router;