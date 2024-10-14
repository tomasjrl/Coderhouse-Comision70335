import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "./productManager.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "carrito.json");
const productManager = new ProductManager();

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
        console.error(
          "Error al cargar carrito.json. Se utilizará un array vacío.",
          error
        );
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
    const newId =
      this.carts.length > 0 ? Math.max(...this.carts.map((c) => c.id)) + 1 : 1;
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
    const product = productManager.getProductById(productId);
  
    if (!product) {
      throw new Error(`Producto no encontrado con ID ${productId}`);
    }
  
    const existingProduct = cart.products.find(
      (productInCart) => productInCart.product === productId
    );
  
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
  
    this.saveCarts();
    return cart;
  }
}

export default CartManager;
