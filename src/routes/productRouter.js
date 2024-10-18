import express from "express";

const productRouter = (productManager) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json(productManager.getAllProducts());
  });

  router.get("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    const product = productManager.getProductById(pid);
    
    if (!product) {
      // Si no se encuentra el producto, pasamos a next() sin mensaje
      return next(); 
    }
    
    res.json(product);
  });

  router.post("/", (req, res, next) => {
    try {
      const addProduct = productManager.addProduct(req.body);
      res.status(201).json(addProduct);
    } catch (error) {
      next(); // Pasar al middleware sin mensaje
    }
  });

  router.put("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    try {
      const updatedProduct = productManager.updateProduct(pid, req.body);
      res.json(updatedProduct);
    } catch (error) {
      next(); // Pasar al middleware sin mensaje
    }
  });

  router.delete("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    try {
      productManager.deleteProductForSocket(pid);
      res.status(204).json();
    } catch (error) {
      next(); // Pasar al middleware sin mensaje
    }
  });

  // Middleware para manejar errores
  router.use((err, req, res, next) => {
    // No se imprime el mensaje del error en la consola
    res.status(404).json({ message: "Producto no encontrado" }); // Responder con un mensaje genérico
  });

  return router;
};

export default productRouter;
