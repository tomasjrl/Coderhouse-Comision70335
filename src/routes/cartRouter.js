import express from 'express';
import CartManager from '../controllers/cartManager.js'; 
import ProductManager from '../controllers/productManager.js'; 
import { ObjectId } from 'mongodb'; 

const cartRouter = express.Router();
let cartManager; 
let productManager; // Define la variable aquí

// Función para inicializar el router con las colecciones
const initializeCartRouter = (cartCollection, productCollection) => {
    cartManager = new CartManager(cartCollection);
    productManager = new ProductManager(productCollection); // Asegúrate de pasar la colección de productos
};

// Rutas para manejar carritos
cartRouter.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        const newCart = await cartManager.createCart(products);
        res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al crear el carrito" });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Verificar si el ID es un ObjectId válido
        if (!ObjectId.isValid(cartId)) {
            return res.status(404).json({ message: "ID inválido. Debe ser una cadena hexadecimal de 24 caracteres." });
        }

        const cart = await cartManager.getCart(cartId);
        const products = await cartManager.getProductsInCart(cartId);

        // Combina el carrito con sus productos para evitar duplicación
        res.json({ cart: { ...cart, products } });
    } catch (error) {
        if (error.message.includes("Carrito no encontrado")) {
            res.status(404).json({ message: "Carrito no encontrado" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error interno al obtener el carrito" });
        }
    }
});

cartRouter.put('/:cid', async (req, res) => {
  try {
      const cartId = req.params.cid; // ID del carrito
      const { products } = req.body; // Obtén el arreglo de productos del cuerpo de la solicitud

      // Llama al método para actualizar los productos en el carrito
      const updatedCart = await cartManager.updateProductsInCart(cartId, products);
      
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
      if (error.message.includes("Carrito no encontrado")) {
          res.status(404).json({ message: "Carrito no encontrado" });
      } else {
          console.error(error);
          res.status(500).json({ message: "Error interno al actualizar productos en el carrito" });
      }
  }
});

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const clearedCart = await cartManager.clearProductsInCart(cartId);
        res.json(clearedCart);
    } catch (error) {
        if (error.message.includes("Carrito no encontrado")) {
            res.status(404).json({ message: "Carrito no encontrado" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error interno al eliminar productos del carrito" });
        }
    }
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid; // ID del carrito
        const productId = req.params.pid; // ID del producto

        // Verificar si el producto existe en la colección
        await productManager.getProductById(productId); // Llama al método para verificar existencia

        // Lógica para agregar el producto al carrito
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.status(200).json(updatedCart); // Devuelve el carrito actualizado
    } catch (error) {
        if (error.message.includes("Carrito no encontrado")) {
            res.status(404).json({ message: "Carrito no encontrado" });
        } else if (error.message.includes("Producto no encontrado")) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error interno al agregar producto al carrito" });
        }
    }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
      const cartId = req.params.cid; // ID del carrito
      const productId = req.params.pid; // ID del producto
      
      const { quantity } = req.body; // Obtén la nueva cantidad del cuerpo de la solicitud
      
      if (!quantity || typeof quantity !== 'number') { // Verifica que se proporcione una cantidad válida
          return res.status(400).json({ message: "Debe proporcionar una cantidad válida en el cuerpo de la solicitud" });
      }

      const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, quantity); // Llama al método para actualizar la cantidad
      
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
      if (error.message.includes("Carrito no encontrado")) {
          res.status(404).json({ message: "Carrito no encontrado" });
      } else if (error.message.includes("Producto no encontrado")) {
          res.status(404).json({ message: "Producto no encontrado en el carrito" });
      } else {
          console.error(error);
          res.status(500).json({ message: "Error interno al actualizar cantidad del producto en el carrito" });
      }
  }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const cartId = req.params.cid; // ID del carrito
      const productId = req.params.pid; // ID del producto
      
      const updatedCart = await cartManager.removeProductFromCart(cartId, productId); // Llama al método para eliminar el producto
      
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
      if (error.message.includes("Carrito no encontrado")) {
          res.status(404).json({ message: "Carrito no encontrado" });
      } else if (error.message.includes("Producto no encontrado")) {
          res.status(404).json({ message: "Producto no encontrado en el carrito" });
      } else {
          console.error(error);
          res.status(500).json({ message: "Error interno al eliminar producto del carrito" });
      }
  }
});

// Exportar como default
export default cartRouter;

// Exportar la función de inicialización
export { initializeCartRouter };
