import express from "express";

const productRouter = (getAllProducts, getProductById, addProduct, updateProduct, deleteProduct) => {
  const router = express.Router();

  const handleError = (res, error) => {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  };

  router.get("/", (req, res) => {
    const limit = req.query.limit;
    try {
      const products = getAllProducts(limit ? parseInt(limit) : null);
      res.json(products);
    } catch (error) {
      handleError(res, error);
    }
  });

  router.get("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    try {
      const product = getProductById(pid);
      res.json(product);
    } catch (error) {
      handleError(res, error);
    }
  });

  router.post("/", (req, res) => {
    try {
      const newProduct = addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      handleError(res, error);
    }
  });

  router.put("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    try {
      const updatedProduct = updateProduct(pid, req.body);
      res.json(updatedProduct);
    } catch (error) {
      handleError(res, error);
    }
  });

  router.delete("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    try {
      deleteProduct(pid);
      res.status(204).json();
    } catch (error) {
      handleError(res, error);
    }
  });

  return router;
};

export default productRouter;
