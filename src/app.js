import express from 'express';
import 'dotenv/config';
import cartRouter from './routes/cartRouter.js';
import productRouter from './routes/productRouter.js';



const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8080;

app.use(api+'/products', productRouter);
app.use(api+'/carts', cartRouter);


app.listen(PORT, () => {
  console.log(api)
  console.log(`Servidor escuchando en PORT ${PORT}`);
});