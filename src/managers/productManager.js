import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', '..', 'data', 'products.json');



export function getAllProducts(req,res) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(products);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ message: 'Archivo de productos no encontrado' });
    } else {
      res.status(500).json({ message: 'Error interno al crear el producto' });
    }
  }
}

export function getProduct(req, res) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const productId = req.params.pid;
    const product = products.find((product) => product.id === parseInt(productId));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Archivo de productos no encontrado' });
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(500).json({ message: 'Error interno al crear el producto' });
    }
  }
}

// export function createProduct(req, res) {
//   res.send('Creando un nuevo producto');
// }

export function createProduct(req, res) {
  try {
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error interno al crear el producto' });
  }
}

export function updateProduct(req, res) {
  res.send(`Actualizando el producto con id ${req.params.pid}`);
}

export function deleteProduct(req, res) {
  res.send(`Eliminando el producto con id ${req.params.pid}`);
}