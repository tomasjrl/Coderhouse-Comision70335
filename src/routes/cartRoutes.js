// revisar este codigo en el futuro, por ahora solo sirve de modelo
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCartById);
router.post('/:id/products', cartController.addProductToCart);
router.delete('/:id/products/:productId', cartController.deleteProductFromCart);

module.exports = router;