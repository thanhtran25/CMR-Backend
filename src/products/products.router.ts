import * as express from 'express';
import {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSaleProducts
} from './products.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';
import { productImageUpload } from '../core/static/image.static';

const router = express.Router();

router.get('/', getProducts);
router.get('/sale', getSaleProducts);
router.post('/', authorization(Roles.MANAGER, Roles.STAFF), productImageUpload.array('images', 2), createProduct);

router.get('/:id', getProduct);
router.put('/:id', authorization(Roles.MANAGER, Roles.STAFF), productImageUpload.array('images', 2), updateProduct);
router.delete('/:id', authorization(Roles.MANAGER, Roles.STAFF), deleteProduct);

export default router;