import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from "./utils.js";
import 'dotenv/config';
import cartRouter from './routes/cartRouter.js';
import productRouter from './routes/productRouter.js';


const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8080;

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());

// AL MOMENTO NO FUNCIONA, FALTA COMPLETAR CODIGO
//  app.get('/', (req, res) => { 
//  const products = getAllProducts();
// res.render('index', { products });
// });
// AL MOMENTO NO FUNCIONA, FALTA COMPLETAR CODIGO
//  app.get('/productos-en-tiempo-real', (req, res) => {
//   res.render('realTimeProducts', { products: [] }); // por ahora, pasamos una lista vacía
//  });

// probando estaticamente lista de productos = FUNCIONA
app.get('/', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10.99 },
    { id: 2, nombre: 'Producto 2', precio: 9.99 },
    { id: 3, nombre: 'Producto 3', precio: 12.99 },
  ];
  res.render('index', { products: productos });
});

// probando estaticamente lista de productos  = FUNCIONA
app.get('/productos-en-tiempo-real', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Producto 10', precio: 10.99 },
    { id: 2, nombre: 'Producto 11', precio: 9.99 },
    { id: 3, nombre: 'Producto 12', precio: 12.99 },
  ];
  res.render('realTimeProducts', { products: productos });
});

app.use(api+'/products', productRouter);
app.use(api+'/carts', cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});