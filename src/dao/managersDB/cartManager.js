import Cart from "../models/cartModel.js"; // Asegúrate de importar el modelo Cart
import Product from "../models/productModel.js"; // Importa el modelo Producto para la validación
import mongoose from "mongoose";

const {
  Types: { ObjectId },
} = mongoose; // Extrae ObjectId de mongoose

class CartManager {
  constructor() {
    this.collection = Cart; // Usa el modelo Mongoose
  }

  async createCart(products) {
    const newCart = { products: [] }; // Inicializa el carrito vacío

    if (products && Array.isArray(products)) {
      newCart.products = products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));
    }

    const result = await this.collection.create(newCart); // Inserta el nuevo carrito en la colección
    return { _id: result._id, ...newCart }; // Retorna el nuevo carrito con su ID
  }

  async getCart(cartId) {
    return await this.collection.findById(cartId).populate("products.product"); // Usa populate aquí
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCart(cartId); // Obtiene el carrito existente

    // Verifica si el productId es un ObjectId válido
    if (!ObjectId.isValid(productId)) {
      throw new Error(`ID de producto inválido: ${productId}`);
    }

    // Busca el producto por ID en la colección de productos
    const productExists = await Product.findById(productId);
    if (!productExists) {
      throw new Error(`Producto con ID ${productId} no encontrado.`);
    }

    // Convierte productId a ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productObjectId)
    ); // Busca si el producto ya está en el carrito

    if (productIndex !== -1) {
      // Si el producto ya existe, incrementa su cantidad
      cart.products[productIndex].quantity++;
    } else {
      // Si no existe, agrega el nuevo producto con cantidad 1
      cart.products.push({ product: productObjectId, quantity: 1 });
    }

    await this.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(cartId) },
      { $set: { products: cart.products } }
    ); // Actualiza el carrito en la base de datos
    return cart; // Retorna el carrito actualizado
  }

  async updateProductsInCart(cartId, products) {
    const cart = await this.getCart(cartId); // Obtiene el carrito existente

    if (!Array.isArray(products)) {
      throw new Error("Los productos deben ser un arreglo.");
    }

    const updatedProducts = products.map((item) => {
      if (
        !item.product ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        throw new Error(
          "Cada producto debe tener un ID y una cantidad válida mayor a 0."
        );
      }
      return {
        product: new mongoose.Types.ObjectId(item.product), // Convierte a ObjectId
        quantity: item.quantity,
      };
    });

    await this.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(cartId) },
      { $set: { products: updatedProducts } }
    );

    return { _id: cartId, products: updatedProducts }; // Retorna el carrito actualizado
  }

  async updateProductQuantityInCart(cartId, productId, newQuantity) {
    const cart = await this.getCart(cartId); // Obtiene el carrito existente
    const productObjectId = new mongoose.Types.ObjectId(productId); // Convierte productId a ObjectId

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productObjectId)
    ); // Busca si el producto está en el carrito

    if (productIndex !== -1) {
      if (newQuantity > 0) {
        cart.products[productIndex].quantity = newQuantity; // Actualiza la cantidad
      } else {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      await this.collection.updateOne(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $set: { products: cart.products } }
      ); // Actualiza el carrito en la base de datos
      return cart; // Retorna el carrito actualizado
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }

  async clearProductsInCart(cartId) {
    await this.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(cartId) },
      { $set: { products: [] } }
    );
    return { message: "Productos eliminados del carrito" };
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCart(cartId); // Obtiene el carrito existente

    if (!ObjectId.isValid(productId)) {
      // Asegúrate de usar ObjectId aquí
      throw new Error("ID inválido para el producto.");
    }

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(new ObjectId(productId))
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await this.collection.updateOne(
        { _id: new ObjectId(cartId) },
        { $set: { products: cart.products } }
      );
      return cart;
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }
}

export default CartManager;
