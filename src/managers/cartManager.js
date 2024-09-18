import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "..", "data", "carts.json");

export function getCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === parseInt(cartId));
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "Archivo de carritos no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno al obtener el carrito" });
    }
  }
}

export function createCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const newId =
      carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const newCart = {
      id: newId,
      products: [],
    };
    carts.push(newCart);
    fs.writeFileSync(dataPath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error interno al crear el carrito" });
  }
}

export function addProductToCart(req, res) {
  try {
    const carts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const cartId = req.params.cid;
    const productId = req.params.pid;

    if (!/^\d+$/.test(productId) || parseInt(productId) <= 0) {
      res.status(400).json({ message: "ID del producto inválido" });
      return;
    }

    const cart = carts.find((cart) => cart.id === parseInt(cartId));
    if (!cart) {
      res.status(404).json({ message: "Carrito no encontrado" });
      return;
    }
    const product = cart.products.find(
      (product) => product.product === parseInt(productId)
    );
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: parseInt(productId), quantity: 1 });
    }
    fs.writeFileSync(dataPath, JSON.stringify(carts, null, 2));
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno al agregar producto al carrito" });
  }
}
