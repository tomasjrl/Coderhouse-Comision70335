import express from 'express';
import CartManager from '../controllers/cartManager.js'; 

const cartRouter = express();
const cartManager = new CartManager();

cartRouter.post('/', (req, res) => {
  try {
    const newCart = cartManager.createCart(); 
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error interno al crear el carrito" });
  }
});

cartRouter.get('/:cid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCart(cartId); 
    res.json(cart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al obtener el carrito" });
    }
  }
});

cartRouter.post("/:cid/products/:pid", (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = cartManager.addProductToCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res
        .status(404)
        .json({ message: `Carrito no encontrado con ID ${req.params.cid}` });
    } else if (error.message.includes("Producto no encontrado")) {
      res
        .status(404)
        .json({ message: `Producto no encontrado con ID ${req.params.pid}` });
    } else {
      res
        .status(500)
        .json({ message: "Error interno al agregar producto al carrito" });
    }
  }
});

export default cartRouter;