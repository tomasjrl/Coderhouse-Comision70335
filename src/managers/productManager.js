import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "data", "products.json");

export function getAllProducts(req = null, res = null) {
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
        throw new Error("Archivo de productos no encontrado");
      }
    } else {
      if (res) {
        res.status(500).json({ message: "Error interno al obtener productos" });
      } else {
        throw new Error("Error interno al obtener productos");
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
      res.status(500).json({ message: "Error interno al obtener el producto" });
    }
  }
}

export function createProduct(req, res = null) {
  try {
    const products = getAllProducts();
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price,
      status,
      stock,
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

export function deleteProduct(req, res = null) {
  try {
    let products = getAllProducts();
    const productId = req.body ? parseInt(req.body.id) : parseInt(req.params.pid);
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
        throw new Error("Producto no encontrado");
      }
    }
  } catch (error) {
    if (res) {
      res.status(500).json({ message: "Error al eliminar producto" });
    } else {
      throw new Error("Error al eliminar producto");
    }
  }
}

// Funciones adicionales para el manejo en tiempo real
export function createProductSocket(product) {
  createProduct({ body: product });
}

export function deleteProductSocket(productId) {
  deleteProduct({ body: { id: productId } });
}