import * as express from 'express';
import {
    createUser,
    deleteUser,
    updateUser,
    getUsers,
    getUser,
    changePassword,
    changePosition
} from './users.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/me/password', authorization(), changePassword);

router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/position/:id', authorization(Roles.ADMIN), changePosition);

export default router;