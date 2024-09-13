const express = require('express');
const app = express();
const puerto = 8080;
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.get('/', (req, res) => {
  res.send('Hola mundo!');
});

app.listen(puerto, () => {
  console.log(`Servidor escuchando en puerto ${puerto}`);
});