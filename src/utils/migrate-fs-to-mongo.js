// Importaciones
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Producto from '../models/producto.js';

// Configuración
const DB_URL = 'mongodb://localhost:27017/e-commerce';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FS_DATA_FILE = path.join(__dirname, '../../data/products.json');

// Conectar a MongoDB
mongoose.connect(DB_URL);

// Leer datos de FS
const datosFS = fs.readFileSync(FS_DATA_FILE, 'utf8');
const productosFS = JSON.parse(datosFS);

// Función para migrar datos
async function migrateData() {
  try {
    // Eliminar productos existentes en MongoDB (opcional)
    // await Producto.deleteMany({});

    // Insertar datos en MongoDB
    for (const producto of productosFS) {
      try {
        const nuevoProducto = new Producto(producto);
        await nuevoProducto.save();
        console.log(`Producto insertado: ${producto.title}`);
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