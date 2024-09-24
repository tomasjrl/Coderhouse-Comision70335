import express from "express";
import ProductManager from "../managers/productManager.js";

const productRouter = express.Router();
const productManager = new ProductManager();

const getAllProducts = (req, res) => {
  try {
    const products = productManager.getAllProducts();
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
  try {
    const updatedProduct = productManager.updateProduct(productId, updates);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
