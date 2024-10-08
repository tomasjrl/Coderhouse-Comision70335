// Importaciones
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Carrito from '../models/carrito.js'; // Importa el modelo Carrito

// Configuración
const DB_URL = 'mongodb://localhost:27017/e-commerce';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FS_DATA_FILE = path.join(__dirname, '../data/carts.json');

// Conectar a MongoDB
mongoose.connect(DB_URL);

// Leer datos de FS
const datosFS = fs.readFileSync(FS_DATA_FILE, 'utf8');
const carritosFS = JSON.parse(datosFS);

// Función para migrar datos
async function migrateData() {
    try {
        for (const carrito of carritosFS) {
            const nuevoCarrito = {
                products: []
            };

            if (carrito.products && carrito.products.length > 0) {
                for (const item of carrito.products) {
                    if (!mongoose.Types.ObjectId.isValid(item.product)) {
                        console.warn(`ID del producto inválido: ${item.product}`);
                        continue; // Ignorar este producto si no es válido
                    }

                    nuevoCarrito.products.push({
                        product: item.product, // Usa directamente el _id del producto desde carts.json
                        quantity: item.quantity
                    });
                }
            }

            const carritoMongo = new Carrito(nuevoCarrito);
            await carritoMongo.save();
            console.log(`Carrito insertado con éxito: ${carritoMongo._id}`);
        }
    } catch (error) {
        console.error("Error al migrar carritos:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Ejecutar función de migración
migrateData();
