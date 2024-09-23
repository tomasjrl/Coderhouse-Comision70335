import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productManager.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:pid", getProduct);
productRouter.post("/", createProduct);
productRouter.put("/:pid", updateProduct);
productRouter.delete("/:pid", deleteProduct);

export default productRouter;
