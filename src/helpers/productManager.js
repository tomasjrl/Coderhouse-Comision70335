// revisar funciones, por ahora sirve de modelo
const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    product.id = products.length + 1;
    products.push(product);
    fs.writeFileSync(this.path, JSON.stringify(products));
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(product => product.id === parseInt(id));
  }
}

module.exports = ProductManager;