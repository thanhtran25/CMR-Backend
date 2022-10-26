import * as express from 'express';
import {
    getProduct,
    getProducts,
    createProduct
} from './products.controller';
import { authorization } from '../core/middleware/auth.middleware'
import { Roles } from '../core/enum';
import { productImageUpload } from '../core/static/image.static';

const router = express.Router();

router.get('/', getProducts);
router.post('/', productImageUpload.array('images', 2), createProduct);

router.get('/:id', productImageUpload.array('images', 2), getProduct);

export default router;