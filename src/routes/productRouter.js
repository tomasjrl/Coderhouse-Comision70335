import express from "express";
import ProductManager from "../managers/productManager.js";

const productRouter = express.Router();
const productManager = new ProductManager();

const getAllProducts = (req, res) => {
  const limit = req.query.limit;

  // Validar el parámetro limit
  if (limit !== undefined) {
    // Verifica si es un número entero positivo
    if (!/^\d+$/.test(limit) || parseInt(limit) <= 0) {
      return res.status(400).json({
        error: "?limit= debe ser un número entero positivo"
      });
    }
  }

  try {
    const parsedLimit = limit ? parseInt(limit) : null;
    const products = productManager.getAllProducts(parsedLimit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduct = (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addProduct = (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  try {
    const newProduct = productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = (req, res) => {
  const productId = parseInt(req.params.pid);
  const updates = req.body;
  const result = productManager.updateProduct(productId, updates);

  if (result.error) {
    res.status(result.statusCode).json({ error: result.error });
  } else {
    res.status(result.statusCode).json(result.data);
  }
};

const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deletedProduct = productManager.deleteProduct(productId);
    res.status(204).json(deletedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

productRouter.get("/", getAllProducts);
productRouter.get("/:pid", getProduct);
productRouter.post("/", addProduct);
productRouter.put("/:pid", updateProduct);
productRouter.delete("/:pid", deleteProduct);

export default productRouter;
