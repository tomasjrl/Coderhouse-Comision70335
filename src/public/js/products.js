document.addEventListener('DOMContentLoaded', function() {
  const addToCartBtns = document.querySelectorAll('.btn-primary');

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
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
  });
});