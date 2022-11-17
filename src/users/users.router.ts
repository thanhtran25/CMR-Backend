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
    recoverUser
} from './users.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';

const router = express.Router();

router.get('/', getUsers);
router.get('/locked', getLockedUsers);
router.post('/', authorization(Roles.ADMIN, Roles.MANAGER), createUser);
router.put('/me/password', authorization(), changePassword);

router.get('/:id', getUser);
router.put('/:id', authorization(Roles.ADMIN, Roles.MANAGER), updateUser);
router.put('/locked/:id', authorization(Roles.ADMIN, Roles.MANAGER), recoverUser);
router.delete('/:id', authorization(Roles.ADMIN, Roles.MANAGER), deleteUser);
router.put('/position/:id', authorization(Roles.ADMIN), changePosition);

export default router;