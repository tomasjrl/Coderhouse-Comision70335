import express from "express";

const productRouter = (getAllProducts, getProductById, addProduct, updateProduct, deleteProduct) => {
  const router = express.Router();

  const handleError = (res, error) => {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  };

  router.get("/", (req, res) => {
    const limit = req.query.limit;
  
    if (limit !== undefined) {
      const parsedLimit = parseInt(limit, 10);
      
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ message: "?limit= Debe ser un número entero positivo" });
      }
    }
  
    const result = getAllProducts(limit ? parseInt(limit, 10) : null);
    res.json(result);
  });

  router.get("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    try {
      const product = getProductById(pid);
      res.json(product);
    } catch (error) {
      if (error.message.includes("Producto no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      handleError(res, error); // Manejo de otros errores
    }
  });

  router.post("/", (req, res, next) => {
    try {
      const result = addProduct(req.body);
      res.status(201).json(result);
    } catch (error) {
      // Manejo específico de errores
      const errorMessages = [
        "El Título debe ser de tipo string",
        "La descripción debe ser de tipo string",
        "El código debe ser de tipo string",
        "El precio debe ser un número positivo",
        "El estado (status) debe ser un valor booleano (true/false)",
        "El stock debe ser un número entero no negativo",
        "La categoría debe ser de tipo string",
        "El campo thumbnails debe ser un arreglo de strings o vacío",
        "Faltan los siguientes campos requeridos",
        "Ya existe un producto con el código"
      ];
  
      if (errorMessages.some(msg => error.message.includes(msg))) {
        return res.status(400).json({ message: error.message });
      }
      
      // Pasar otros errores al middleware de manejo de errores
      next(error);
    }
  });
  

  router.put("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    
    try {
      const updatedProduct = updateProduct(pid, req.body);
      res.json(updatedProduct);
    } catch (error) {
      if (error.message.includes("Producto no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("No se permite actualizar el ID del producto") ||
          error.message.includes("No se permiten los siguientes campos") ||
          error.message.includes("El campo") || 
          error.message.includes("Faltan los siguientes campos requeridos")) {
        return res.status(400).json({ message: error.message });
      }

      handleError(res, error); 
    }
  });

  router.delete("/:pid", (req, res) => {
    const pid = Number(req.params.pid);
    
    try {
      deleteProduct(pid);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes("Producto no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      handleError(res, error); // Manejo de otros errores
    }
  });

  return router;
};

export default productRouter;
