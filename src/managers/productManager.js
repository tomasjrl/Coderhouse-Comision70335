import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "productos.json");

class ProductManager {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        console.error(
          "Error al cargar productos.json. Se utilizará un array vacío.",
          error
        );
        return [];
      }
    }
  }

  saveProducts() {
    fs.writeFileSync(dataPath, JSON.stringify(this.products, null, 2));
  }

  getAllProducts(limit = null) {
    if (limit === null) {
      return this.products;
    }
  
    if (typeof limit !== "number" || limit <= 0) {
      return { error: true, message: "?limit= Debe ser un número entero positivo" };
    }
  
    return this.products.slice(0, limit);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error(`Producto no encontrado con ID ${id}`);
    }
    return product;
  }

  addProduct(productData) {
    const requiredLabels = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category"
    ];

    const missingLabels = requiredLabels.filter(
      (label) => !(label in productData)
    );
    if (missingLabels.length > 0) {
      throw new Error(
        `Faltan los siguientes campos requeridos: ${missingLabels.join(", ")}`
      );
    }

      let {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = productData;

    if (typeof title !== "string") {
      throw new Error("El Título debe ser de tipo string");
    }

    if (typeof description !== "string") {
      throw new Error("La descripción debe ser de tipo string");
    }

    if (typeof category !== "string") {
      throw new Error("La categoría debe ser de tipo string");
    }

    if (typeof code !== "string") {
      throw new Error("El código debe ser de tipo string");
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error(`Ya existe un producto con el código ${code}`);
    }
    
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }

    if (typeof status !== "boolean") {
      throw new Error(
        "El estado (status) debe ser un valor booleano (true/false)"
      );
    }

    if (!Number.isInteger(stock) || stock < 0 || typeof stock !== "number") {
      throw new Error("El stock debe ser un número entero no negativo");
    }

    if (
      !Array.isArray(thumbnails) ||
      !thumbnails.every((thumbnail) => typeof thumbnail === "string")
    ) {
      throw new Error(
        "El campo thumbnails debe ser un arreglo de strings o vacío"
      );
    }

    const newId =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id)) + 1
        : 1;
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
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updates) {
    if (updates.id !== undefined) {
        throw new Error("No se permite actualizar el ID del producto");
    }

    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
        throw new Error(`No se puede actualizar. Producto no encontrado con ID ${id}`);
    }

    const allowedFields = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnails",
    ];

    const unknownFields = Object.keys(updates).filter((field) => !allowedFields.includes(field));
    if (unknownFields.length > 0) {
        throw new Error(`No se permiten los siguientes campos: ${unknownFields.join(", ")}`);
    }

    const filteredUpdates = {};
    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            filteredUpdates[field] = updates[field];
        }
    }

    const stringFields = ["title", "description", "category", "code"];
    stringFields.forEach(field => {
        if (filteredUpdates[field] !== undefined && typeof filteredUpdates[field] !== "string") {
            throw new Error(`El campo ${field} debe ser un string`);
        }
    });

    const validatePositiveNumber = (value, fieldName, isInteger = false) => {
        if (typeof value !== "number" || value <= 0 || (isInteger && !Number.isInteger(value))) {
            throw new Error(`El campo ${fieldName} debe ser un número ${isInteger ? 'entero no negativo' : 'positivo'}`);
        }
    };

    if (filteredUpdates.stock !== undefined) {
        validatePositiveNumber(filteredUpdates.stock, 'stock', true);
    }

    if (filteredUpdates.price !== undefined) {
        validatePositiveNumber(filteredUpdates.price, 'price');
    }

    if (filteredUpdates.code !== undefined) {
        if (this.products.some((p) => p.code === filteredUpdates.code && p.id !== id)) {
            throw new Error(`Ya existe un producto con el código ${filteredUpdates.code}`);
        }
    }

    if (filteredUpdates.status !== undefined && typeof filteredUpdates.status !== "boolean") {
        throw new Error("El status debe ser un valor booleano (true/false)");
    }

    if (filteredUpdates.thumbnails !== undefined) {
      const { thumbnails } = filteredUpdates;
      if (!Array.isArray(thumbnails) || !thumbnails.every((thumbnail) => typeof thumbnail === "string")) {
          throw new Error("El campo thumbnails debe ser un arreglo de strings o vacío");
      }
  }

    this.products[productIndex] = { ...this.products[productIndex], ...filteredUpdates };
    return this.products[productIndex];
}

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error(
        `No se puede eliminar. Producto no encontrado con ID ${id}`
      );
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    this.saveProducts();
    return deletedProduct;
  }
}

export default ProductManager;

