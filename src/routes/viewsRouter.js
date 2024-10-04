import express from "express";
import ProductManager from "../controllers/productManager.js";
import CartManager from "../controllers/cartManager.js";

const viewsRouter = express.Router();
const viewsRealTimeRouter = express.Router();

// Asegúrate de pasar la colección de productos al ProductManager
const productManager = new ProductManager(); // Este debe recibir la colección en su constructor
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
  const sort = req.query.sort;
  const status = req.query.status;
  const category = req.query.category;
  const query = req.query.query;

  try {
    let products = await productManager.getAllProducts();

    // Filtrar y ordenar productos
    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

    if (status === "true") {
      products = products.filter((product) => product.status === true);
    } else if (status === "false") {
      products = products.filter((product) => product.status === false);
    }

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    if (query) {
      products = products.filter((product) => {
        return (
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.price.toString().includes(query)
        );
      });
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / limit);

    // Obtener categorías
    const categories = await productManager.getCategories();

    res.render("index", { 
      products: paginatedProducts, 
      page, 
      limit, 
      totalPages,
      sort,
      status,
      category,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

viewsRouter.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id; // ID como string para MongoDB
    const product = await productManager.getProductById(id); // Usar el método asincrónico
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    const backUrl = req.headers.referer;
    res.render("product-details", { product, backUrl }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCart(cartId);
    
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const products = await cartManager.getProductsInCart(cartId);
    
    res.render("cart-details", { cart, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener carrito" });
  }
});

viewsRealTimeRouter.get("/", async (req, res) => {
  await renderProductsView(req, res, "realTimeProducts");
});

export { viewsRouter, viewsRealTimeRouter };
