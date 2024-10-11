// Importaciones
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';

// Configuración
const DB_URL = 'mongodb://localhost:27017/e-commerce';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FS_DATA_FILE = path.join(__dirname, '../data/products.json');

// Conectar a MongoDB
mongoose.connect(DB_URL);

// Leer datos de FS
const dataFS = fs.readFileSync(FS_DATA_FILE, 'utf8');
const productsFS = JSON.parse(dataFS);

// Función para migrar datos
async function migrateData() {
  try {
    // Eliminar productos existentes en MongoDB (opcional)
    // await Producto.deleteMany({});

    // Insertar datos en MongoDB
    for (const product of productsFS) {
      try {
        const newProduct = new Product(product);
        await newProduct.save();
        console.log(`Producto insertado: ${product.title}`);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Cerrar conexión con MongoDB
    mongoose.connection.close();
  }
}

// Ejecutar función de migración
migrateData();