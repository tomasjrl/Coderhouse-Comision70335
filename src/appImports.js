import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cartRouter } from "./routes/cartRouter.js";
import { productRouter } from "./routes/productRouter.js";
import { viewsRouter, viewsRealTimeRouter } from "./routes/viewsRouter.js";
import { getAllProducts, createProductForSocket, deleteProductForSocket } from "./controllers/productManager.js";

export {
  express,
  handlebars,
  http,
  Server,
  fileURLToPath,
  dirname,
  cartRouter,
  productRouter,
  viewsRouter,
  viewsRealTimeRouter,
  getAllProducts,
  createProductForSocket,
  deleteProductForSocket,
};
