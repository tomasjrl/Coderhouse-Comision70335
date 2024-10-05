import mongoose, { Schema } from 'mongoose';

// Definición del esquema para los productos dentro del carrito
const productoSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Producto', required: true }, // Referencia a Producto
    quantity: { type: Number, required: true }
}, { _id: false }); // Deshabilitar el _id para este subdocumento

// Definición del esquema para el carrito
const carritoSchema = new Schema({
    products: [productoSchema] // Arreglo de productos
});

// Crear el modelo Carrito
const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
