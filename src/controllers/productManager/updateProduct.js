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

export function updateProduct(req, res) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const updatedProduct = {
        ...products[productIndex],
        ...req.body,
      };

      products[productIndex] = updatedProduct;
      fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno al actualizar el producto" });
  }
}
