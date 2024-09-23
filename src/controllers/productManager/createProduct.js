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

export function createProduct(req, res = null) {
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    const priceAsNumber = Number(price);
    const stockAsNumber = Number(stock);

    if (isNaN(priceAsNumber) || isNaN(stockAsNumber)) {
      throw new Error("El precio y el stock deben ser números válidos");
    }

    let products = [];
    if (fs.existsSync(dataPath)) {
      products = getAllProducts();
    }

    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price: priceAsNumber,
      status,
      stock: stockAsNumber,
      category,
      thumbnails,
    };

    products.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

    if (res) {
      res.status(201).json(newProduct);
    }
  } catch (error) {
    if (res) {
      res.status(500).json({ message: "Error interno al crear el producto" });
    } else {
      throw new Error("Error interno al crear el producto");
    }
  }
}

export function createProductForSocket(product) {
  createProduct({ body: product });
}
