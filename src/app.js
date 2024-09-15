import express from 'express';
import hbs from 'express-handlebars';
import 'dotenv/config';
import cartRouter from './routes/cartRouter.js';
import productRouter from './routes/productRouter.js';


const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8080;

// revisar no funciona
app.engine('handlebars', hbs.engine({
  defaultLayout: 'main',
  layoutsDir: '../views/layouts',
  partialsDir: '../views/partials'
}));

// revisar no funciona
app.set('view engine', 'handlebars');
app.set('views', '../view'); // revisar ruta no funciona

app.use(express.json());

// falta configurar
// app.get('/', (req, res) => { 
//   const products = getAllProducts();
//   res.render('index', { products });
// });

// falta configurar
// app.get('/productos-en-tiempo-real', (req, res) => {
//   res.render('realTimeProducts', { products: [] }); // por ahora, pasamos una lista vacía
// });

// probando estaticamente lista de productos 
app.get('/', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10.99 },
    { id: 2, nombre: 'Producto 2', precio: 9.99 },
    { id: 3, nombre: 'Producto 3', precio: 12.99 },
  ];
  res.render('index', { products: productos });
});

// probando estaticamente lista de productos
app.get('/productos-en-tiempo-real', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10.99 },
    { id: 2, nombre: 'Producto 2', precio: 9.99 },
    { id: 3, nombre: 'Producto 3', precio: 12.99 },
  ];
  res.render('realTimeProducts', { products: productos });
});

app.use(api+'/products', productRouter);
app.use(api+'/carts', cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en PORT ${PORT}`);
});