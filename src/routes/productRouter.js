import express from "express";

const productRouter = (productManager) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json(productManager.getAllProducts());
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
      const newProduct = productManager.addProduct(req.body);
      res.status(201).json(newProduct);
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