import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "data", "products.json");

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
          "Error al cargar products.json. Se utilizará un array vacío.",
          error
        );
        return [];
      }
    }
  }

  saveProducts() {
    fs.writeFileSync(dataPath, JSON.stringify(this.products, null, 2));
  }

  getAllProducts() {
    return this.products;
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
      "category",
      "thumbnails",
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
      status,
      stock,
      category,
      thumbnails,
    } = productData;

    if (typeof code !== "string") {
      throw new Error("El código debe ser de tipo string");
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error(`Ya existe un producto con el código ${code}`);
    }

    if (typeof status !== "boolean") {
      throw new Error(
        "El estado (status) debe ser un valor booleano (true/false)"
      );
    }

    if (typeof stock === "string") {
      stock = parseInt(stock);
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("El stock debe ser un número entero no negativo");
    }
    
    if (typeof price === "string") {
      price = parseFloat(price);
    }
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }

    if (
      !Array.isArray(thumbnails) ||
      !thumbnails.every((thumbnail) => typeof thumbnail === "string")
    ) {
      throw new Error(
        "El campo thumbnails debe ser un arreglo de strings"
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

  addProductForSocket(product) {
    try {
      product.status = product.status || true;
      product.thumbnails = product.thumbnails || [];
      return this.addProduct(product);
    } catch (error) {
      console.error("Error al crear producto mediante socket:", error);
      throw new Error("Error interno al crear el producto");
    }
  }

  updateProduct(id, updates) {
    if (updates.id !== undefined) {
      throw new Error("No se permite actualizar el ID del producto");
    }

    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      throw new Error(
        `No se puede actualizar. Producto no encontrado con ID ${id}`
      );
    }

    if (updates.code !== undefined) {
      if (typeof updates.code !== "string") {
        throw new Error("El código debe ser un string");
      }
      if (this.products.some((p) => p.code === updates.code && p.id !== id)) {
        throw new Error(`Ya existe un producto con el código ${updates.code}`);
      }
    }

    if (updates.status !== undefined && typeof updates.status !== "boolean") {
      throw new Error("El status debe ser un valor booleano (true/false)");
    }

    if (
      updates.stock !== undefined &&
      (!Number.isInteger(updates.stock) || updates.stock < 0)
    ) {
      throw new Error("El stock debe ser un número entero no negativo");
    }

    if (
      updates.price !== undefined &&
      (typeof updates.price !== "number" || updates.price <= 0)
    ) {
      throw new Error("El precio debe ser un número positivo");
    }

    if (
      updates.thumbnails &&
      (!Array.isArray(updates.thumbnails) ||
        updates.thumbnails.length === 0 ||
        !updates.thumbnails.every((thumbnail) => typeof thumbnail === "string"))
    ) {
      throw new Error(
        "El campo thumbnails debe ser un arreglo no vacío de strings"
      );
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
    };
    this.saveProducts();
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

  deleteProductForSocket(productId) {
    try {
      if (!this.getProductById(productId)) {
        throw new Error(`Producto no encontrado con ID ${productId}`);
      }
      return this.deleteProduct(productId);
    } catch (error) {
      console.error("Error al eliminar producto mediante socket:", error);
      throw new Error("Error interno al eliminar el producto");
    }
  }
}

export default ProductManager;

