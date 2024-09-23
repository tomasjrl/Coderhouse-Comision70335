import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "..", "data", "carts.json");

export function addProductToCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const cartId = req.params.cid;
    const productId = req.params.pid;

    if (!/^\d+$/.test(productId) || parseInt(productId) <= 0) {
      res.status(400).json({ message: "ID del producto inválido" });
      return;
    }

    const cart = carts.find((cart) => cart.id === parseInt(cartId));
    if (!cart) {
      res.status(404).json({ message: "Carrito no encontrado" });
      return;
    }
    const product = cart.products.find(
      (product) => product.product === parseInt(productId)
    );
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: parseInt(productId), quantity: 1 });
    }
    fs.writeFileSync(dataPath, JSON.stringify(carts, null, 2));
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno al agregar producto al carrito" });
  }
}
