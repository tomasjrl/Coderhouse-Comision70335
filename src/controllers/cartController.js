export function createCart(req, res) {
  res.send('Creando una nueva carta');
}

export function getCart(req, res) {
  res.send(`Obteniendo la carta con id ${req.params.cid}`);
}

export function addProductToCart(req, res) {
  res.send(`Agregando producto a la carta con id ${req.params.cid}`);
}