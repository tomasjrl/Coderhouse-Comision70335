import {
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
} from "./appImports.js";

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.emit("products", getAllProducts());

  socket.on("newProduct", (product) => {
    createProductForSocket(product);
    io.emit("products", getAllProducts());
  });

  socket.on("deleteProduct", (productId) => {
    deleteProductForSocket(productId);
    socket.emit("products", getAllProducts());
  });

  socket.on("getProducts", () => {
    socket.emit("products", getAllProducts());
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });
});

app.use("/products", viewsRouter);
app.use("/realtimeproducts", viewsRealTimeRouter);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});
