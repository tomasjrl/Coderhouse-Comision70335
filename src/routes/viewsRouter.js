import express from 'express';
import { getAllProducts } from '../managers/productManager.js';

const viewsRouter = express.Router();

viewsRouter.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render('index', { products, style: "../../css/index.css" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

export default viewsRouter;