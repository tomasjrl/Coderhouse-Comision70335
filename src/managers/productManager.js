import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "data", "products.json");

export function getAllProducts(req, res = null) {
  try {
    // Intentamos leer el archivo
    const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    if (res) {
      res.json(products);
    } else {
      return products;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      if (res) {
        res.status(500).json({ message: "Error interno al obtener los productos" });
      } else {
        return [];
      }
    } else {
      if (res) {
        res.status(500).json({ message: "Error interno al obtener los productos" });
      } else {
        throw new Error("Error interno al obtener los productos");
      }
    }
  }
}

export function getProduct(req, res) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const productId = req.params.pid;
    const product = products.find(
      (product) => product.id === parseInt(productId)
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "Archivo de productos no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al obtener el producto" });
    }
  }
}

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

    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

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

export function createProductSocket(product) {
createProduct({ body: product });
}