import { ObjectId } from "mongodb"; // Importar ObjectId para manejar IDs de MongoDB

class ProductManager {
    constructor(collection) {
        this.collection = collection; // Asigna la colección de MongoDB
    }

    async getAllProducts() {
      console.log("Colección:", this.collection);
        return await this.collection.find().toArray(); // Obtiene todos los productos de la colección
    }

    async getCategories() {
        const products = await this.getAllProducts();
        const categories = [...new Set(products.map((product) => product.category))];
        return categories;
    }

    async getProductById(id) {
        const product = await this.collection.findOne({ _id: new ObjectId(id) }); // Busca el producto por ID
        if (!product) {
            throw new Error(`Producto no encontrado con ID ${id}`);
        }
        return product;
    }

    async addProduct(productData) {
        const requiredLabels = [
            "title",
            "description",
            "code",
            "price",
            "status",
            "stock",
            "category",
            // "thumbnails",
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
            status = true, // Valor por defecto para status
            stock,
            category,
            // thumbnails = [], // Valor por defecto para thumbnails
        } = productData;

        if (typeof code !== "string") {
            throw new Error("El código debe ser de tipo string");
        }

        const existingProduct = await this.collection.findOne({ code });
        if (existingProduct) {
            throw new Error(`Ya existe un producto con el código ${code}`);
        }

        if (typeof status !== "boolean") {
            throw new Error("El estado (status) debe ser un valor booleano (true/false)");
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
            throw new Error("El campo thumbnails debe ser un arreglo de strings");
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            // thumbnails,
        };

        const result = await this.collection.insertOne(newProduct); // Inserta el nuevo producto en la colección
        return { id: result.insertedId, ...newProduct }; // Retorna el nuevo producto con su ID
    }

    async addProductForSocket(product) {
        try {
            return await this.addProduct(product);
        } catch (error) {
            console.error("Error al crear producto mediante socket:", error);
            throw new Error("Error interno al crear el producto");
        }
    }

    async updateProduct(id, updates) {
        if (updates.id !== undefined) {
            throw new Error("No se permite actualizar el ID del producto");
        }

        const product = await this.getProductById(id); // Verifica si el producto existe

        if (updates.code !== undefined) {
            if (typeof updates.code !== "string") {
                throw new Error("El código debe ser un string");
            }
            
            const existingProduct = await this.collection.findOne({ code: updates.code });
            
            if (existingProduct && existingProduct._id.toString() !== id) {
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

      const updatedProduct = { ...product, ...updates };
      await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct }); // Actualiza el producto en la colección
      return updatedProduct;
  }

  async deleteProduct(id) {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) }); // Elimina el producto por ID

      if (result.deletedCount === 0) {
          throw new Error(`No se puede eliminar. Producto no encontrado con ID ${id}`);
      }
      
      return { message: `Producto con ID ${id} eliminado` }; // Retorna un mensaje de éxito
  }

  async deleteProductForSocket(productId) {
      try {
          return await this.deleteProduct(productId);
      } catch (error) {
          console.error("Error al eliminar producto mediante socket:", error);
          throw new Error("Error interno al eliminar el producto");
      }
  }
}

export default ProductManager;
