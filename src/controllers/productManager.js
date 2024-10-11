import mongoose from 'mongoose'; // Importa mongoose para manejar ObjectId
import Producto from '../models/productModel.js'; // Asegúrate de que la ruta sea correcta

class ProductManager {
    constructor() {
        this.collection = Producto; // Usa el modelo Producto aquí
    }

    async getAllProducts() {
        return await this.collection.find(); // Obtiene todos los productos de la colección
    }

    async getCategories() {
        const products = await this.getAllProducts();
        const categories = [...new Set(products.map((product) => product.category))];
        return categories;
    }

    async getProductById(id) {
        const product = await this.collection.findById(id); // Busca el producto por ID usando Mongoose
        if (!product) {
            // En lugar de lanzar un error, simplemente retorna null o un objeto vacío
            return null; // O puedes lanzar un error con un mensaje más genérico si prefieres
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
            // "thumbnails", // Si decides usar thumbnails, asegúrate de descomentar esta línea
        ];

        // Verifica si faltan campos requeridos
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

        // Validación del tipo de datos
        if (typeof title !== "string") {
            throw new Error("El título debe ser un string");
        }
        if (typeof description !== "string") {
            throw new Error("La descripción debe ser un string");
        }
        if (typeof code !== "string") {
            throw new Error("El código debe ser un string");
        }

        // Verifica si el código ya existe
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

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            // thumbnails, // Asegúrate de incluir esto si decides usar thumbnails
        };

        const result = await this.collection.create(newProduct); // Inserta el nuevo producto en la colección
        return { id: result._id, ...newProduct }; // Retorna el nuevo producto con su ID
    }

    async updateProduct(id, updates) {
      if (updates.id !== undefined) {
          throw new Error("No se permite actualizar el ID del producto");
      }
  
      const product = await this.getProductById(id); // Verifica si el producto existe
  
      // Validación del código
      if (updates.code !== undefined) {
          if (typeof updates.code !== "string") {
              throw new Error("El código debe ser un string");
          }
          
          const existingProduct = await this.collection.findOne({ code: updates.code });
          
          if (existingProduct && existingProduct._id.toString() !== id) {
              throw new Error(`Ya existe un producto con el código ${updates.code}`);
          }
      }
  
      // Validación del estado
      if (updates.status !== undefined && typeof updates.status !== "boolean") {
          throw new Error("El status debe ser un valor booleano (true/false)");
      }
  
      // Validación del stock
      if (
          updates.stock !== undefined &&
          (!Number.isInteger(updates.stock) || updates.stock < 0)
      ) {
          throw new Error("El stock debe ser un número entero no negativo");
      }
  
      // Validación del precio
      if (
          updates.price !== undefined &&
          (typeof updates.price !== "number" || updates.price <= 0)
      ) {
          throw new Error("El precio debe ser un número positivo");
      }
  
      const updatedProduct = { ...product, ...updates };
      
      await this.collection.updateOne({ _id: id }, { $set: updatedProduct }); // Actualiza el producto en la colección
      
      return updatedProduct; // Retorna el producto actualizado
  }

    async deleteProduct(id) {
        // Validar si el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            throw new Error("ID inválido. Debe ser una cadena hexadecimal de 24 caracteres.");
        }

        const result = await this.collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) }); 

        if (result.deletedCount === 0) {
            throw new Error(`No se puede eliminar. Producto no encontrado con ID ${id}`);
        }
        
        return { message: `Producto con ID ${id} eliminado` }; 
    }
}

export default ProductManager;
