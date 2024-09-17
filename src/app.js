import express from "express";
import handlebars from "express-handlebars";
import "dotenv/config";
import __dirname from "./utils.js";
import cartRouter from "./routes/cartRouter.js";
import productRouter from "./routes/productRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import realtimeproductsRouter from "./routes/realtimeproducts.router.js";

const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8080;

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());


// AL MOMENTO NO FUNCIONA, FALTA COMPLETAR CODIGO
//  app.get('/productos-en-tiempo-real', (req, res) => {
//   res.render('realTimeProducts', { products: [] }); // por ahora, pasamos una lista vacía
//  });

app.use("/products", viewsRouter);
app.use("/productos/productosentiemporeal", realtimeproductsRouter);

app.use(api + "/products", productRouter);
app.use(api + "/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});
