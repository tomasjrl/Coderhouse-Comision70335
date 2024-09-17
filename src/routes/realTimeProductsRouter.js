import express from 'express';
import { getAllProducts } from '../managers/productManager.js';

const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

export default realTimeProductsRouter;