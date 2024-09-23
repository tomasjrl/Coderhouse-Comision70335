import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "..", "data", "carts.json");

export function getCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === parseInt(cartId));
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "Archivo de carritos no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al obtener el carrito" });
    }
  }
}
