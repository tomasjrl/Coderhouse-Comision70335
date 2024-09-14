import express from 'express';
import { createCart, getCart, addProductToCart } from '../controllers/cartController.js';

const cartRouter = express();

cartRouter.post('/', createCart);
cartRouter.get('/:cid', getCart);
cartRouter.post('/:cid/product/:pid', addProductToCart);


export default cartRouter;



// import express from 'express';
// const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).send('Ruta de carts funciona correctamente');
// });

// export default router;