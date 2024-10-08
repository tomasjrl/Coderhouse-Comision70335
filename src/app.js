import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { viewsRouter, viewsRealTimeRouter } from "./routes/viewsRouter.js";
import cartRouter, { initializeCartRouter } from "./routes/cartRouter.js"; // Importa ambas
import productRouter from "./routes/productRouter.js";
import ProductManager from "./controllers/productManager.js"; 
import helpers from "./utils/helpersHandlebars.js";
import { MongoClient } from "mongodb"; 

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

// Conexión a MongoDB
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "e-commerce";
let productsCollection;
let cartsCollection;

async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Conectado a la base de datos");
    const db = client.db(dbName);
    productsCollection = db.collection("productos"); // Guarda la colección de productos en una variable
    cartsCollection = db.collection("carritos"); // Guarda la colección de carritos en una variable
}

// Conectar a la base de datos y luego inicializar el ProductManager y CartManager
connectToDatabase().then(() => {
    // Crear una instancia del ProductManager
    const productManager = new ProductManager(productsCollection); 

    // Inicializar el CartManager con la colección de carritos y productos
    initializeCartRouter(cartsCollection, productsCollection); // Inicializa el router aquí

    // Configuración de Socket.io
    io.on("connection", (socket) => {
        console.log("Un cliente se ha conectado");

        socket.on("getProducts", async () => {
            const products = await productManager.getAllProducts();
            console.log("Productos obtenidos en Socket:", products); 
            socket.emit("products", products);
        });

        socket.on("addProduct", async (product) => {
            await productManager.addProduct(product);
            const products = await productManager.getAllProducts();
            console.log("Productos después de agregar:", products); 
            io.emit("products", products);
        });

        socket.on("deleteProduct", async (productId) => {
            await productManager.deleteProduct(productId);
            const products = await productManager.getAllProducts();
            console.log("Productos después de eliminar:", products); 
            io.emit("products", products);
        });

        socket.on("disconnect", () => {
            console.log("Un cliente se ha desconectado");
        });
    });

    // Rutas de la aplicación
    app.use("/", viewsRouter);
    app.use("/realtimeproducts", viewsRealTimeRouter);
    app.use("/api/products", productRouter(productManager)); // Asegúrate de que tu router acepte el ProductManager
    app.use("/api/carts", cartRouter); // Usa el router aquí

    // Iniciar el servidor
    server.listen(PORT, () => {
       console.log(`Servidor escuchando en PORT ${PORT}`);
   });
}).catch(err => console.error("Error al conectar a la base de datos:", err));
