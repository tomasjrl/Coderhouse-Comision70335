import express from 'express';
import { getAllProducts } from '../managers/productManager.js';

const viewsRouter = express.Router();
const viewsRealTimeRouter = express.Router();

const renderProductsView = async (req, res, viewName) => {
  try {
    const products = await getAllProducts();
    res.render(viewName, { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

viewsRouter.get('/', async (req, res) => {
  await renderProductsView(req, res, 'index');
});

viewsRealTimeRouter.get('/', async (req, res) => {
  await renderProductsView(req, res, 'realTimeProducts');
});

export { viewsRouter, viewsRealTimeRouter };