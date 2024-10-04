import express from "express";
import { ObjectId } from "mongodb";

const productRouter = (productManager) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            let products = await productManager.getAllProducts();
            console.log("Productos obtenidos desde /api/products:", products); // Confirmación de que la ruta funciona y muestra los productos
            const category = req.query.category;
            const stock = req.query.stock;
            const sort = req.query.sort;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;

            // Validaciones
            if (isNaN(page) || page < 1) {
                return res.status(400).json({ error: "Número de página inválido" });
            }

            if (isNaN(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({ error: "Límite de productos inválido" });
            }

            // Filtrar por categoría
            if (category) {
                const normalizedCategory = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                products = products.filter((product) => product.category.toLowerCase().includes(normalizedCategory));
                if (products.length === 0) {
                    return res.status(404).json({ message: `No se encontraron productos con la categoría '${category}'` });
                }
            }

            // Filtrar por stock
            if (stock === "true") {
                products = products.filter((product) => product.stock > 0);
            } else if (stock === "false") {
                products = products.filter((product) => product.stock === 0);
            }

            // Paginación
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = products.slice(startIndex, endIndex);

            const totalPages = Math.ceil(products.length / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const response = {
                status: "success",
                payload: paginatedProducts,
                totalPages,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `?page=${page - 1}&limit=${limit}` : null,
                nextLink: hasNextPage ? `?page=${page + 1}&limit=${limit}` : null,
            };

            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error al obtener productos" });
        }
    });

    router.get("/:pid", async (req, res) => {
      try {
          const productId = req.params.pid;

          // Convierte el ID a ObjectId antes de buscarlo
          const product = await productManager.getProductById(new ObjectId(productId)); // Usa 'new' aquí
          res.json({ status: "success", payload: product });
      } catch (error) {
          console.error("Error al obtener producto:", error);
          res.status(404).json({ status: "error", message: error.message });
      }
  });

    router.post("/", async (req, res) => {
        try {
            const requiredLabels = ["title", "description", "code", "price", "status", "stock", "category"];
            
            for (const label of requiredLabels) {
                if (!req.body[label]) {
                    return res.status(400).json({ status: "error", message: `El campo ${label} es requerido` });
                }
            }

            const result = await productManager.addProduct(req.body);
            res.status(201).json({ status: "success", payload: result });
        } catch (error) {
            console.error(error);
            
            if (error.message.startsWith("Ya existe un producto con el código")) {
                return res.status(400).json({ status: "error", message: error.message });
            }
            
            res.status(500).json({ status: "error", message: "Error al crear producto" });
        }
    });

    router.put("/:pid", async (req, res) => {
        try {
            const productId = req.params.pid;

            // Verifica si el producto existe
            await productManager.getProductById(productId);

            const updatedProduct = await productManager.updateProduct(productId, req.body);
            
            res.json({ status: "success", payload: updatedProduct });
        } catch (error) {
            console.error(error);
            
            if (error.message.startsWith("Producto no encontrado")) {
                return res.status(404).json({ status: "error", message: error.message });
            }
            
            res.status(500).json({ status: "error", message: "Error al actualizar producto" });
        }
    });

    router.delete("/:pid", async (req, res) => {
        try {
            const productId = req.params.pid;

            await productManager.deleteProductForSocket(productId);
            
            res.status(200).json({ status: "success", message: "Producto eliminado con éxito" });
        } catch (error) {
            console.error(error);
            
            if (error.message.startsWith("Producto no encontrado")) {
                return res.status(404).json({ status: "error", message: error.message });
            }
            
            res.status(500).json({ status: "error", message: "Error al eliminar producto" });
        }
    });

    return router;
};

export default productRouter;
