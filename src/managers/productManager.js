export function getAllProducts(req, res) {
  res.send('Obteniendo todos los productos');
}

export function getProduct(req, res) {
  res.send(`Obteniendo el producto con id ${req.params.pid}`);
}

export function createProduct(req, res) {
  res.send('Creando un nuevo producto');
}

export function updateProduct(req, res) {
  res.send(`Actualizando el producto con id ${req.params.pid}`);
}

export function deleteProduct(req, res) {
  res.send(`Eliminando el producto con id ${req.params.pid}`);
}