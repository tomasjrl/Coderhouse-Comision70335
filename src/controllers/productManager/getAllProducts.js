import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "products.json"
);

export function getAllProducts(req, res = null) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    if (res) {
      res.json(products);
    } else {
      return products;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      if (res) {
        res.status(404).json({ message: "Archivo de productos no encontrado" });
      } else {
        return [];
      }
    } else {
      if (res) {
        res
          .status(500)
          .json({ message: "Error interno al obtener los productos" });
      } else {
        throw new Error("Error interno al obtener los productos");
      }
    }
  }
}
