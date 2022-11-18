import * as express from 'express';
import {
    createUser,
    deleteUser,
    updateUser,
    getUsers,
    getUser,
    changePassword,
    changePosition,
    getLockedUsers,
    recoverUser,
    getMe
} from './users.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', authorization(Roles.ADMIN, Roles.MANAGER), getUsers);
router.get('/me', authorization(), getMe);
router.get('/locked', authorization(Roles.ADMIN), getLockedUsers);
router.post('/', authorization(Roles.ADMIN, Roles.MANAGER), createUser);
router.put('/me/password', authorization(), changePassword);

router.get('/:id', authorization(Roles.ADMIN, Roles.MANAGER), getUser);
router.put('/:id', authorization(Roles.ADMIN, Roles.MANAGER), updateUser);
router.put('/locked/:id', authorization(Roles.ADMIN), recoverUser);
router.delete('/:id', authorization(Roles.ADMIN), deleteUser);
router.put('/position/:id', authorization(Roles.ADMIN), changePosition);

export default router;