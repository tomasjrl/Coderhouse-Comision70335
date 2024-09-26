import express from "express";
import ProductManager from "../controllers/productManager.js";
import CartManager from "../controllers/cartManager.js";

const viewsRouter = express.Router();
const viewsRealTimeRouter = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

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

viewsRouter.get("/products", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  await renderProductsView(req, res, "index", page, limit);
});

viewsRouter.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    } else {
      const backUrl = req.headers.referer;
      res.render("product-details", { product, backUrl }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCart(cartId);
    const products = await cartManager.getProductsInCart(cartId);
    res.render("cart-details", { cart, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener carrito" });
  }
});

// viewsRouter.get("/", async (req, res) => {
//   const page = req.query.page ? parseInt(req.query.page) : 1;
//   const limit = req.query.limit ? parseInt(req.query.limit) : 10;
//   await renderProductsView(req, res, "index", page, limit);
// });

// viewsRouter.get("/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const product = await productManager.getProductById(id);
//     if (!product) {
//       res.status(404).json({ message: "Producto no encontrado" });
//     } else {
//       const backUrl = req.headers.referer;
//       res.render("product-details", { product, backUrl }); 
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener producto" });
//   }
// });

// viewsRouter.get("/:cid", async (req, res) => {
//   try {
//     const cartId = parseInt(req.params.cid);
//     const cart = await cartManager.getCart(cartId);
//     const products = await cartManager.getProductsInCart(cartId);
//     res.render("cart-details", { cart, products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener carrito" });
//   }
// });

viewsRealTimeRouter.get("/", async (req, res) => {
  await renderProductsView(req, res, "realTimeProducts");
});

export { viewsRouter, viewsRealTimeRouter };