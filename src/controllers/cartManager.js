import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "./productManager.js";
const productManager = new ProductManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "data", "carts.json");

class CartManager {
  constructor() {
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        console.error("Error al cargar carts.json. Se utilizará un array vacío.", error);
        return [];
      }
    }
  }

  saveCarts() {
    fs.writeFileSync(dataPath, JSON.stringify(this.carts, null, 2));
  }

  getCart(id) {
    const cart = this.carts.find((cart) => cart.id === id);
    if (!cart) {
      throw new Error(`Carrito no encontrado con ID ${id}`);
    }
    return cart;
  }

  createCart() {
    const newId = this.carts.length > 0 ? Math.max(...this.carts.map((c) => c.id)) + 1 : 1;
    const newCart = {
      id: newId,
      products: [],
    };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  updateProductsInCart(cartId, products) {
    const cart = this.getCart(cartId);
    cart.products = products;
    this.saveCarts();
    return cart;
  }

  clearProductsInCart(cartId) {
    const cart = this.getCart(cartId);
    cart.products = [];
    this.saveCarts();
    return cart;
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCart(cartId);
    const product = cart.products.find((product) => product.product === productId);
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    this.saveCarts();
    return cart;
  }

  updateProductQuantityInCart(cartId, productId, newQuantity) {
    const cart = this.getCart(cartId);
    const productIndex = cart.products.findIndex((product) => product.product === productId);
    if (productIndex !== -1) {
      if (newQuantity > 0) {
        cart.products[productIndex].quantity = newQuantity;
        this.saveCarts();
        return cart;
      } else {
        throw new Error(`Cantidad inválida. Debe ser mayor a 0`);
      }
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }

  removeProductFromCart(cartId, productId) {
    const cart = this.getCart(cartId);
    const productIndex = cart.products.findIndex((product) => product.product === productId);
    if (productIndex !== -1) {
      if (cart.products[productIndex].quantity === 1) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity--;
      }
      this.saveCarts();
      return cart;
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }

  async getProductsInCart(cartId) {
    const cart = this.getCart(cartId);
    const products = [];
    for (const product of cart.products) {
      const productId = product.product;
      const productData = await productManager.getProductById(productId);
      products.push({ ...productData, quantity: product.quantity });
    }
    return products;
  }

}

export default CartManager;
