import express from 'express';
import CartManager from '../controllers/cartManager.js'; 
import { ObjectId } from 'mongodb'; // Asegúrate de importar ObjectId

const cartRouter = express.Router();
let cartManager; // Definimos cartManager aquí

// Asignar la colección de carritos al CartManager
const initializeCartRouter = (collection) => {
    cartManager = new CartManager(collection);
};

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); 
        res.status(201).json(newCart);
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
        const cartId = req.params.cid;
        const { products } = req.body;
        
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ message: "Debe proporcionar un arreglo de productos en el cuerpo de la solicitud" });
        }

        const updatedCart = await cartManager.updateProductsInCart(cartId, products);
        res.json(updatedCart);
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
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.status(200).json(updatedCart); 
    } catch (error) {
        if (error.message.includes("Carrito no encontrado")) {
            res.status(404).json({ message: "Carrito no encontrado" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error interno al agregar producto al carrito" });
        }
    }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        const { quantity } = req.body;
        
        if (!quantity) {
            return res.status(400).json({ message: "Debe proporcionar la cantidad en el cuerpo de la solicitud" });
        }

        const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);
        
        res.status(200).json(updatedCart);
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
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        
        res.json(updatedCart);
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
