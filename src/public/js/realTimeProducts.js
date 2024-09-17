const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Obtener la lista inicial de productos
socket.emit('getProducts');

socket.on('products', (products) => {
  productList.innerHTML = products.map(product => `
    <div class="product">
      <h2>${product.title}</h2>
      <p>Descripción: ${product.description}</p>
      <p>Precio: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      <button onclick="deleteProduct(${product.id})">Eliminar</button>
    </div>
  `).join('');
});

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    stock: document.getElementById('stock').value,
    category: document.getElementById('category').value
  };
  socket.emit('newProduct', product);
  productForm.reset();
});

function deleteProduct(productId) {
  socket.emit('deleteProduct', productId);
}