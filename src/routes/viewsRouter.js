import express from "express";
import ProductManager from "../controllers/productManager.js";

const viewsRouter = express.Router();
const viewsRealTimeRouter = express.Router();

const productManager = new ProductManager();

const renderProductsView = async (req, res, viewName) => {
  try {
    const products = await productManager.getAllProducts();
    res.render(viewName, { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

viewsRouter.get("/", async (req, res) => {
  await renderProductsView(req, res, "index");
});

viewsRealTimeRouter.get("/", async (req, res) => {
  await renderProductsView(req, res, "realTimeProducts");
});

export { viewsRouter, viewsRealTimeRouter };