import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllProducts } from "./getAllProducts.js";
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

export function deleteProduct(req, res) {
  try {
    const products = getAllProducts();
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
}

export function deleteProductForSocket(productId) {
  try {
    const products = getAllProducts();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    } else {
      console.error("Producto no encontrado para eliminar.");
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
  }
}

export function deleteProductSocket(productId) {
  deleteProductForSocket(parseInt(productId));
}
