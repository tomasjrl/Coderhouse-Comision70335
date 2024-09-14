import express from 'express';
import { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:pid', getProduct);
productRouter.post('/', createProduct);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export default productRouter;

// import express from 'express';
// const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).send('Ruta de carts funciona correctamente');
// });

// export default router;