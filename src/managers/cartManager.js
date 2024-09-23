import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

  deleteProductFromCart(cartId, productId) {
    const cart = this.getCart(cartId);
    const productIndex = cart.products.findIndex((product) => product.product === productId);
    if (productIndex === -1) {
      throw new Error(`Producto no encontrado en el carrito con ID ${cartId}`);
    }
    cart.products.splice(productIndex, 1);
    this.saveCarts();
    return cart;
  }

  deleteCart(id) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === id);
    if (cartIndex === -1) {
      throw new Error(`Carrito no encontrado con ID ${id}`);
    }
    this.carts.splice(cartIndex, 1);
    this.saveCarts();
    return true;
  }
}

export default CartManager;