import { ObjectId } from "mongodb";

class CartManager {
  constructor(collection) {
    this.collection = collection; // Asigna la colección de MongoDB
  }

  async createCart() {
    const newCart = { products: [] }; // Carrito vacío al inicio
    const result = await this.collection.insertOne(newCart);
    return { id: result.insertedId, ...newCart }; // Retorna el nuevo carrito con su ID
  }

  async getCart(cartId) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) });
    if (!cart) {
      throw new Error(`Carrito no encontrado con ID ${cartId}`);
    }
    return cart;
  }

  async getProductsInCart(cartId) {
    const cart = await this.getCart(cartId);
    return cart.products; // Retorna los productos del carrito
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCart(cartId);
    
    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } });
    return cart; // Retorna el carrito actualizado
  }

  async updateProductQuantityInCart(cartId, productId, newQuantity) {
    const cart = await this.getCart(cartId);
    
    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex !== -1) {
      if (newQuantity > 0) {
        cart.products[productIndex].quantity = newQuantity;
      } else {
        throw new Error("La cantidad debe ser mayor a 0");
      }
      
      await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } });
      return cart; // Retorna el carrito actualizado
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }

  async clearProductsInCart(cartId) {
    await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: [] } });
    return { message: "Productos eliminados del carrito" }; // Mensaje de éxito
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCart(cartId);
    
    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1); // Elimina el producto del carrito
      await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } });
      return cart; // Retorna el carrito actualizado
    } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`);
    }
  }
}

export default CartManager;
