// routes.js

import express from 'express';
import ProductManager from '../managers/productManager.js'; // Asegúrate de que la ruta sea correcta

const productRouter = express.Router();
const productManager = new ProductManager(); // Crear una instancia de ProductManager

// Controlador para obtener todos los productos
const getAllProducts = (req, res) => {
  try {
    const products = productManager.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener un producto por ID
const getProduct = (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Controlador para crear un nuevo producto
const createProduct = (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  try {
    const newProduct = productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para actualizar un producto existente
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

// Controlador para eliminar un producto
const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deletedProduct = productManager.deleteProduct(productId);
    res.status(204).json(deletedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Asignar los controladores a las rutas
productRouter.get('/', getAllProducts);
productRouter.get('/:pid', getProduct);
productRouter.post('/', createProduct);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export default productRouter;