import express from "express";
import ProductManager from "../controllers/productManager.js";

const viewsRouter = express.Router();
const viewsRealTimeRouter = express.Router();

const productManager = new ProductManager();

const renderProductsView = async (req, res, viewName, page = 1, limit = 10) => {
  try {
    const products = await productManager.getAllProducts();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / limit);
    res.render(viewName, { products: paginatedProducts, page, limit, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

viewsRouter.get("/", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  await renderProductsView(req, res, "index", page, limit);
});

viewsRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    } else {
      res.render("product-details", { product });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});

viewsRealTimeRouter.get("/", async (req, res) => {
  await renderProductsView(req, res, "realTimeProducts");
});

export { viewsRouter, viewsRealTimeRouter };