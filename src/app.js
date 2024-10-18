import express from "express";
import "dotenv/config";
import cartRouter from "./routes/cartRouter.js";
import ProductManager from "./managers/productManager.js";
import productRouter from "./routes/productRouter.js"; 

const app = express();
const PORT = process.env.PORT || 8080;

const productManager = new ProductManager();

app.use(express.json());

app.use("/api/products", productRouter(
  productManager.getAllProducts.bind(productManager),
  productManager.getProductById.bind(productManager),
  productManager.addProduct.bind(productManager),
  productManager.updateProduct.bind(productManager),
  productManager.deleteProduct.bind(productManager)
));

app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});
