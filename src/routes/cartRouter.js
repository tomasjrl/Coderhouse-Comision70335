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

cartRouter.put('/:cid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      res.status(400).json({ message: "Debe proporcionar un arreglo de productos en el cuerpo de la solicitud" });
    } else {
      const updatedCart = cartManager.updateProductsInCart(cartId, products);
      res.json(updatedCart);
    }
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al actualizar productos en el carrito" });
    }
  }
});

cartRouter.delete('/:cid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const clearedCart = cartManager.clearProductsInCart(cartId);
    res.json(clearedCart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al eliminar productos del carrito" });
    }
  }
});

cartRouter.post('/:cid/products/:pid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = cartManager.addProductToCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al agregar producto al carrito" });
    }
  }
});

cartRouter.put('/:cid/products/:pid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({ message: "Debe proporcionar la cantidad en el cuerpo de la solicitud" });
    } else {
      const newQuantity = parseInt(quantity);
      if (isNaN(newQuantity)) {
        res.status(400).json({ message: "La cantidad debe ser un número" });
      } else {
        const updatedCart = cartManager.updateProductQuantityInCart(cartId, productId, newQuantity);
        res.json(updatedCart);
      }
    }
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else if (error.message.includes("Producto no encontrado")) {
      res.status(404).json({ message: "Producto no encontrado en el carrito" });
    } else {
      res.status(500).json({ message: "Error interno al actualizar cantidad del producto en el carrito" });
    }
  }
});

cartRouter.delete('/:cid/products/:pid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = cartManager.removeProductFromCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else if (error.message.includes("Producto no encontrado")) {
      res.status(404).json({ message: "Producto no encontrado en el carrito" });
    } else {
      res.status(500).json({ message: "Error interno al eliminar producto del carrito" });
    }
  }
});

export default cartRouter;