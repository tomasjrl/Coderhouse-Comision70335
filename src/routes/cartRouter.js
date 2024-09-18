import express from "express";
import {
  createCart,
  getCart,
  addProductToCart,
} from "../managers/cartManager.js";

const cartRouter = express();

cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCart);
cartRouter.post("/:cid/product/:pid", addProductToCart);

export default cartRouter;
