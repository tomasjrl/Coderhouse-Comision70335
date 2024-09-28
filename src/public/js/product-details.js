document.addEventListener('DOMContentLoaded', function() {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const updateQuantityBtn = document.getElementById('update-quantity-btn');
  const quantityInput = document.getElementById('quantity-input');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      fetch(`/api/carts/1/products/${productId}`, { // CARTS/ID FIJO REVISAR
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar producto al carrito');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('Producto agregado al carrito');
      })
      .catch(error => {
        console.error('Error al agregar producto al carrito:', error);
      });
    });
  }

  if (updateQuantityBtn) {
    updateQuantityBtn.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      const quantity = quantityInput.value;
      fetch(`/api/carts/1/products/${productId}`, { // CARTS/ID FIJO REVISAR
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: parseInt(quantity) })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar cantidad');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('Cantidad actualizada');
      })
      .catch(error => {
        console.error('Error al actualizar cantidad:', error);
      });
    });
  }
});