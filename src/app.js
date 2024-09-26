import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { viewsRouter, viewsRealTimeRouter } from "./routes/viewsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import productRouter from "./routes/productRouter.js";
import ProductManager from "./controllers/productManager.js";
import helpers from "./utils/helpers.js";

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine("handlebars", handlebars.engine({  helpers: helpers }));

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

const productManager = new ProductManager();
const productRouterInstance = productRouter(productManager);



io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.emit("products", productManager.getAllProducts());

  socket.on("addProduct", (product) => {
    productManager.addProductForSocket(product);
    io.emit("products", productManager.getAllProducts());
  });

  socket.on("deleteProduct", (productId) => {
    productManager.deleteProductForSocket(productId);
    io.emit("products", productManager.getAllProducts());
  });

  socket.on("getProducts", () => {
    socket.emit("products", productManager.getAllProducts());
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });
});

app.use("/products", viewsRouter);
app.use("/realtimeproducts", viewsRealTimeRouter);

app.use("/api/products", productRouterInstance);
app.use("/api/carts", cartRouter);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});
