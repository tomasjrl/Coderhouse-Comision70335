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

export function deleteProduct(req, res = null) {
  try {
    const products = getAllProducts();
    const productId = parseInt(req.params?.pid || req.body?.productId);

    if (!productId) {
      throw new Error("ID de producto no proporcionado");
    }

    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

      if (res) {
        res.status(204).json();
      }
    } else {
      if (res) {
        res.status(404).json({ message: "Producto no encontrado" });
      } else {
        console.error("Producto no encontrado para eliminar.");
      }
    }
  } catch (error) {
    if (res) {
      res.status(500).json({ message: "Error al eliminar producto" });
    } else {
      console.error("Error al eliminar producto:", error.message);
    }
  }
}

export function deleteProductForSocket(productId) {
  deleteProduct({ body: { productId } });
}
