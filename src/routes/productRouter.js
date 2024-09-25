import express from "express";

const productRouter = (productManager) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    let products = productManager.getAllProducts();
    const category = req.query.category;
    const stock = req.query.stock;
    const sort = req.query.sort;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

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

    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

    const slicedProducts = products.slice(0, limit);

    res.json(slicedProducts);
  });

  router.get("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
      const product = productManager.getProductById(pid);
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: error.message });
    }
  });

  router.post("/", (req, res) => {
    try {
      const addProduct = productManager.addProduct(req.body);
      res.status(201).json(addProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
      const updatedProduct = productManager.updateProduct(pid, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  router.delete("/:pid", (req, res) => {
    try {
      const pid = Number(req.params.pid);
      productManager.deleteProductForSocket(pid);
      res.status(204).json();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  return router;
};

export default productRouter;
