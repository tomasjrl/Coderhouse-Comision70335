import express from "express";
import CartManager from "../dao/managersDB/cartManager.js";
import ProductManager from "../dao/managersDB/productManager.js";
import Cart from "../dao/models/cartModel.js";
import mongoose from "mongoose"; // Importa mongoose para usar ObjectId

const {
  Types: { ObjectId },
} = mongoose; // Extrae ObjectId de mongoose

const cartRouter = express.Router();
let cartManager;
let productManager;

// Función para inicializar el router con las colecciones
const initializeCartRouter = (cartCollection, productCollection) => {
  cartManager = new CartManager(cartCollection);
  productManager = new ProductManager(productCollection);
};

// Rutas para manejar carritos
cartRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const newCart = await cartManager.createCart(products);
    res.status(201).json({ cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno al crear el carrito" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const cart = await Cart.findById(cartId).populate("products.product"); // Usa populate aquí

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno al obtener el carrito" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid; // ID del carrito
    const { products } = req.body; // Obtén el arreglo de productos del cuerpo de la solicitud

    // Llama al método para actualizar los productos en el carrito
    const updatedCart = await cartManager.updateProductsInCart(
      cartId,
      products
    );

    res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      console.error(error);
      res.status(500).json({
        message: "Error interno al actualizar productos en el carrito",
      });
    }
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const clearedCart = await cartManager.clearProductsInCart(cartId);
    res.json(clearedCart);
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error interno al eliminar productos del carrito" });
    }
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid; // ID del carrito
    const productId = req.params.pid; // ID del producto

    // Validar si el productId es un ObjectId válido
    if (!ObjectId.isValid(productId) || productId.length !== 24) {
      return res.status(400).json({
        message:
          "ID del producto inválido. Debe ser una cadena hexadecimal de 24 caracteres.",
      });
    }

    // Lógica para agregar el producto al carrito
    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    // Obtener el carrito actualizado con populate
    const populatedCart = await cartManager.getCart(cartId);

    res.status(200).json(populatedCart); // Devuelve el carrito actualizado con productos poblados
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    } else if (error.message.includes("Producto con ID")) {
      return res.status(404).json({ message: error.message }); // Mensaje claro sobre el producto no encontrado
    } else {
      // Evita imprimir el error en la consola
      res
        .status(500)
        .json({ message: "Error interno al agregar producto al carrito" });
    }
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid; // ID del carrito
    const productId = req.params.pid; // ID del producto

    const { quantity } = req.body; // Obtén la nueva cantidad del cuerpo de la solicitud

    // Verifica que se proporcione una cantidad válida
    if (!quantity || typeof quantity !== "number") {
      return res.status(400).json({
        message:
          "Debe proporcionar una cantidad válida en el cuerpo de la solicitud",
      });
    }

    // Validar que la cantidad no sea negativa
    if (quantity < 0) {
      return res
        .status(400)
        .json({ message: "La cantidad no puede ser un número negativo." });
    }

    // Verifica que no se estén enviando otros parámetros en el cuerpo
    const allowedFields = ["quantity"];
    const receivedFields = Object.keys(req.body);

    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Los siguientes campos no son permitidos: ${invalidFields.join(
          ", "
        )}`,
      });
    }

    // Llama al método para actualizar la cantidad
    const updatedCart = await cartManager.updateProductQuantityInCart(
      cartId,
      productId,
      quantity
    );

    res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else if (error.message.includes("Producto no encontrado")) {
      res.status(404).json({ message: "Producto no encontrado en el carrito" });
    } else {
      // Manejo de errores inesperados
      res.status(500).json({
        message:
          "Error interno al actualizar cantidad del producto en el carrito",
      });
    }
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid; // ID del carrito
    const productId = req.params.pid; // ID del producto

    const updatedCart = await cartManager.removeProductFromCart(
      cartId,
      productId
    ); // Llama al método para eliminar el producto

    res.status(200).json(updatedCart); // Devuelve el carrito actualizado
  } catch (error) {
    if (error.message.includes("Carrito no encontrado")) {
      res.status(404).json({ message: "Carrito no encontrado" });
    } else if (error.message.includes("Producto no encontrado")) {
      res.status(404).json({ message: "Producto no encontrado en el carrito" });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error interno al eliminar producto del carrito" });
    }
  }
});

// Exportar como default
export default cartRouter;

// Exportar la función de inicialización
export { initializeCartRouter };
