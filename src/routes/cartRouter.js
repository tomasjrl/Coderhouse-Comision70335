import express from "express";
import { createCart } from "../controllers/cartManager/createCart.js";
import { getCart } from "../controllers/cartManager/getCart.js";
import { addProductToCart } from "../controllers/cartManager/addProductToCart.js";

const cartRouter = express();

cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCart);
cartRouter.post("/:cid/product/:pid", addProductToCart);

export default cartRouter;
