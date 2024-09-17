import express from "express";
import handlebars from "express-handlebars";
import "dotenv/config";
import __dirname from "./utils.js";
import { Server } from 'socket.io';
import http from 'http';
import cartRouter from "./routes/cartRouter.js";
import productRouter from "./routes/productRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { getAllProducts, createProductSocket, deleteProductSocket } from './managers/productManager.js';
import realTimeProductsRouter from "./routes/realTimeProductsRouter.js";

const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Enviar la lista inicial de productos
  socket.emit('products', getAllProducts());

  // Manejar la creación de un nuevo producto
  socket.on('newProduct', (product) => {
    createProductSocket(product);
    io.emit('products', getAllProducts());
  });

  // Manejar la eliminación de un producto
  socket.on('deleteProduct', (productId) => {
    deleteProductSocket(productId);
    io.emit('products', getAllProducts());
  });

  // Manejar la solicitud de la lista de productos
  socket.on('getProducts', () => {
    socket.emit('products', getAllProducts());
  });
});

app.use("/products", viewsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

app.use(api + "/products", productRouter);
app.use(api + "/carts", cartRouter);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});