import mongoose, { Schema } from 'mongoose';

// Definición del esquema para los productos dentro del carrito
const productSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia a Producto
    quantity: { type: Number, required: true }
}, { _id: false }); // Deshabilitar el _id para este subdocumento

// Definición del esquema para el carrito
const cartSchema = new Schema({
    products: [productSchema] // Arreglo de productos
}, { versionKey: false }); // Desactivar el campo __v

// Crear el modelo Carrito
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
