import express from "express";

const productRouter = (productManager) => {
  const router = express.Router();

  // Función para manejar errores
  const handleError = (res, error) => {
    res.status(error.status || 500).json({ message: error.message });
  };

  router.get("/", (req, res) => {
    res.json(productManager.getAllProducts());
  });

  router.get("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    try {
      const product = productManager.getProductById(pid);
      res.json(product);
    } catch (error) {
      next(error); // Pasar el error al middleware
    }
  });

  router.post("/", (req, res, next) => {
    try {
      const addProduct = productManager.addProduct(req.body);
      res.status(201).json(addProduct);
    } catch (error) {
      next(error); // Pasar el error al middleware
    }
  });

  router.put("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    
    try {
      const updatedProduct = productManager.updateProduct(pid, req.body); // Llamar correctamente al método
      res.json(updatedProduct);
    } catch (error) {
      next(error); // Pasar el error al middleware
    }
  });

  router.delete("/:pid", (req, res, next) => {
    const pid = Number(req.params.pid);
    try {
      productManager.deleteProductForSocket(pid);
      res.status(204).json(); // Respuesta vacía para eliminar con éxito
    } catch (error) {
      next(error); // Pasar el error al middleware
    }
  });

  // Middleware para manejar errores
  router.use((err, req, res, next) => {
    if (err.message.includes("Producto no encontrado")) {
      return res.status(404).json({ message: err.message });
    }
    
    if (
      err.message.includes("No se permite actualizar el ID del producto") ||
      err.message.includes("No se permiten los siguientes campos") ||
      err.message.includes("El campo") ||
      err.message.includes("Faltan los siguientes campos requeridos") ||
      err.message.includes("El status debe ser un valor booleano")
    ) {
      return res.status(400).json({ message: err.message });
    }

    // Para otros errores no manejados
    res.status(500).json({ message: "Error interno del servidor" });
  });

  return router;
};

export default productRouter;
