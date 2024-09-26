import express from "express";

const productRouter = (productManager) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    let products = productManager.getAllProducts();
    const category = req.query.category;
    const stock = req.query.stock;
    const sort = req.query.sort;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const query = req.query.query;

    if (isNaN(page) || page < 1) {
      res.status(400).json({ error: "Número de página inválido" });
      return;
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({ error: "Límite de productos inválido" });
      return;
    }

    if (
      stock &&
      isNaN(parseInt(stock)) &&
      stock !== "true" &&
      stock !== "false"
    ) {
      res.status(400).json({ error: "Parámetro de stock inválido" });
      return;
    }

    if (category && category.length > 50) {
      res.status(400).json({ error: "Categoría demasiado larga" });
      return;
    }

    if (limit && (limit < 1 || limit > 100)) {
      res.status(400).json({ error: "Límite de productos inválido" });
      return;
    }

    if (page && page < 1) {
      res.status(400).json({ error: "Número de página inválido" });
      return;
    }

    if (category) {
      const normalizedCategory = category
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      products = products.filter((product) => {
        const normalizedProductCategory = product.category
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return normalizedProductCategory.includes(normalizedCategory);
      });

      if (products.length === 0) {
        res.status(404).json({
          message: `No se encontraron productos con la categoría '${category}'`,
        });
        return;
      }
    }

    if (stock) {
      if (stock === "true") {
        products = products.filter((product) => product.stock > 0);
      } else if (stock === "false") {
        products = products.filter((product) => product.stock === 0);
      } else if (!isNaN(parseInt(stock)) && parseInt(stock) >= 0) {
        products = products.filter(
          (product) => product.stock >= parseInt(stock)
        );
        if (products.length === 0) {
          res.status(404).json({
            message: "No se encontraron productos con stock suficiente",
          });
          return;
        }
      } else {
        res
          .status(400)
          .json({ error: "Parámetro de stock inválido o negativo" });
        return;
      }
    }

    if (query) {
      const normalizedQuery = query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      products = products.filter((product) => {
        return (
          (product.title && product.title.includes(normalizedQuery)) ||
          (product.description &&
            product.description.includes(normalizedQuery)) ||
          (product.category && product.category.includes(normalizedQuery))
        );
      });

      if (products.length === 0) {
        res.status(404).json({
          message: `No se encontraron productos con la búsqueda '${query}'`,
        });
        return;
      }
    }

    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const totalPages = Math.ceil(products.length / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevLink = hasPrevPage ? `?page=${page - 1}&limit=${limit}` : null;
    const nextLink = hasNextPage ? `?page=${page + 1}&limit=${limit}` : null;

    const response = {
      status: "success",
      payload: paginatedProducts,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    if (paginatedProducts.length === 0) {
      response.status = "error";
      response.payload = `No se encontraron productos en la página ${page}`;
    }

    res.json(response);
  });

  router.get("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
      const product = productManager.getProductById(pid);
      if (!product) {
        res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
        return;
      }
      res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener producto",
      });
    }
  });

  router.post("/", (req, res) => {
    const requiredlabels = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category"
    ];
  
    for (const label of requiredlabels) {
      if (!req.body[label]) {
        res.status(400).json({
          status: "error",
          message: `El campo ${label} es requerido`,
        });
        return;
      }
    }
  
    try {
      const result = productManager.addProduct(req.body);
      res.status(201).json({
        status: "success",
        payload: result,
      });
    } catch (error) {
      if (error.message.startsWith("Ya existe un producto con el código")) {
        res.status(400).json({
          status: "error",
          message: error.message,
        });
      } else {
        console.error(error);
        res.status(500).json({
          status: "error",
          message: "Error al crear producto",
        });
      }
    }
  });

  router.put("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
  
      const productExists = productManager.getProductById(pid);
      if (!productExists) {
        res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
        return;
      }
  
      const requiredFields = ["title", "description", "code", "price", "status", "stock", "category"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          res.status(400).json({
            status: "error",
            message: `El campo ${field} es requerido`,
          });
          return;
        }
      }
  
      if (req.body.code !== productExists.code && productManager.products.some(p => p.code === req.body.code)) {
        res.status(400).json({
          status: "error",
          message: `Ya existe un producto con el código ${req.body.code}`,
        });
        return;
      }
  
      const updatedProduct = productManager.updateProduct(pid, req.body);
      res.json({
        status: "success",
        payload: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar producto",
      });
    }
  });

  router.delete("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
  
      if (isNaN(pid)) {
        res.status(400).json({
          status: "error",
          message: "ID de producto inválido",
        });
        return;
      }
  
      const productExists = productManager.getProductById(pid);
      if (!productExists) {
        res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
        return;
      }
  
      productManager.deleteProductForSocket(pid);
      res.status(200).json({
        status: "success",
        message: "Producto eliminado con éxito",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar producto",
      });
    }
  });

  return router;
};

export default productRouter;
