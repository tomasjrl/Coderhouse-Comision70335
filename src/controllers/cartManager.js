import { ObjectId } from "mongodb";

class CartManager {
  constructor(collection) {
      this.collection = collection; // Asigna la colección de MongoDB
  }

    async createCart(products) {
        const newCart = { products: [] }; // Inicializa el carrito vacío

        // Si se envían productos en la solicitud, agrégales
        if (products && Array.isArray(products)) {
            newCart.products = products.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));
        }

        const result = await this.collection.insertOne(newCart); // Inserta el nuevo carrito en la colección
        return { _id: result.insertedId, ...newCart }; // Retorna el nuevo carrito con su ID
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
    const cart = await this.getCart(cartId); // Obtiene el carrito existente

    // Convierte productId a ObjectId
    const productObjectId = new ObjectId(productId);
    
    const productIndex = cart.products.findIndex((p) => p.product.equals(productObjectId)); // Busca si el producto ya está en el carrito

    if (productIndex !== -1) {
        // Si el producto ya existe, incrementa su cantidad
        cart.products[productIndex].quantity++;
    } else {
        // Si no existe, agrega el nuevo producto con cantidad 1
        cart.products.push({ product: productObjectId, quantity: 1 }); // Asegúrate de usar productObjectId aquí
    }

    await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } }); // Actualiza el carrito en la base de datos
    return cart; // Retorna el carrito actualizado
}

async updateProductQuantityInCart(cartId, productId, newQuantity) {
  const cart = await this.getCart(cartId); // Obtiene el carrito existente
  const productObjectId = new ObjectId(productId); // Convierte productId a ObjectId

  const productIndex = cart.products.findIndex((p) => p.product.equals(productObjectId)); // Busca si el producto está en el carrito

  if (productIndex !== -1) {
      if (newQuantity > 0) {
          cart.products[productIndex].quantity = newQuantity; // Actualiza la cantidad
      } else {
          throw new Error("La cantidad debe ser mayor a 0"); // Maneja el caso donde la cantidad es 0 o negativa
      }

      await this.collection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } }); // Actualiza el carrito en la base de datos
      return cart; // Retorna el carrito actualizado
  } else {
      throw new Error(`Producto no encontrado en el carrito ${cartId}`); // Maneja el caso donde el producto no está en el carrito
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
