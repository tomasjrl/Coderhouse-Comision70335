import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { viewsRouter, viewsRealTimeRouter } from "./routes/viewsRouter.js";
import cartRouter, { initializeCartRouter } from "./routes/cartRouter.js"; 
import productRouter from "./routes/productRouter.js";
import ProductManager from "./controllers/productManager.js"; 
import helpers from "./utils/helpersHandlebars.js";
import mongoose from 'mongoose'; // Importa mongoose

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Handlebars
const newHelpers = { ...helpers };
newHelpers.isSelected = function(value, sort) {
  return value === sort ? 'selected' : '';
};

app.engine("handlebars", handlebars.engine({ helpers: newHelpers }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Conexión a MongoDB usando Mongoose
const DB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce";

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); // Salir si no se puede conectar
    }
}

// Conectar a la base de datos y luego inicializar el ProductManager y CartManager
connectToDatabase().then(() => {
    // Crear una instancia del ProductManager
    const productManager = new ProductManager();

    // Inicializar el CartManager con el modelo Cart
    initializeCartRouter(); // Inicializa el router aquí

    // Configuración de Socket.io
    io.on("connection", async (socket) => {
        console.log("Un cliente se ha conectado");

        // Emitir productos al conectarse
        const products = await productManager.getAllProducts();
        socket.emit("products", products);

        socket.on("getProducts", async () => {
            const products = await productManager.getAllProducts();
            socket.emit("products", products);
        });

        socket.on("addProduct", async (product) => {
            await productManager.addProduct(product);
            const products = await productManager.getAllProducts();
            io.emit("products", products); // Emitir a todos los clientes
        });

        socket.on("deleteProduct", async (productId) => {
            await productManager.deleteProduct(productId);
            const products = await productManager.getAllProducts();
            io.emit("products", products); // Emitir a todos los clientes
        });

        socket.on("disconnect", () => {
            console.log("Un cliente se ha desconectado");
        });
    });

    // Rutas de la aplicación
    app.use("/", viewsRouter);
    app.use("/realtimeproducts", viewsRealTimeRouter);
    app.use("/api/products", productRouter(productManager)); 
    app.use("/api/carts", cartRouter); 

    // Iniciar el servidor
    server.listen(PORT, () => {
       console.log(`Servidor escuchando en PORT ${PORT}`);
   });
}).catch(err => console.error("Error al conectar a la base de datos:", err));
