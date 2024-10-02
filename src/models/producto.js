import mongoose, { Schema } from 'mongoose';

const productoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;