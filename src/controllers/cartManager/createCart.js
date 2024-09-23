import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "..", "data", "carts.json");

export function createCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const newId =
      carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const newCart = {
      id: newId,
      products: [],
    };
    carts.push(newCart);
    fs.writeFileSync(dataPath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error interno al crear el carrito" });
  }
}
