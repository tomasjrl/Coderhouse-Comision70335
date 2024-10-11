// Importaciones
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Cart from '../models/cartModel.js'; // Importa el modelo Carrito

// Configuración
const DB_URL = 'mongodb://localhost:27017/e-commerce';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FS_DATA_FILE = path.join(__dirname, '../data/carts.json');

// Conectar a MongoDB
mongoose.connect(DB_URL);

// Leer datos de FS
const dataFS = fs.readFileSync(FS_DATA_FILE, 'utf8');
const cartsFS = JSON.parse(dataFS);

// Función para migrar datos
async function migrateData() {
    try {
        for (const cart of cartsFS) {
            const newCart = {
                products: []
            };

            if (cart.products && cart.products.length > 0) {
                for (const item of cart.products) {
                    if (!mongoose.Types.ObjectId.isValid(item.product)) {
                        console.warn(`ID del producto inválido: ${item.product}`);
                        continue; // Ignorar este producto si no es válido
                    }

                    newCart.products.push({
                        product: item.product, // Usa directamente el _id del producto desde carts.json
                        quantity: item.quantity
                    });
                }
            }

            const cartMongo = new Cart(newCart);
            await cartMongo.save();
            console.log(`Carrito insertado con éxito: ${cartMongo._id}`);
        }
    } catch (error) {
        console.error("Error al migrar carritos:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Ejecutar función de migración
migrateData();
