document.addEventListener('DOMContentLoaded', function() {
  const addToCartBtns = document.querySelectorAll('.btn-primary');

  // Obtener el ID del carrito existente
  fetch('/api/carts')
    .then(response => response.json())
    .then(data => {
      const cartId = data.cartId;

      // Agregar evento clic a los botones de agregar al carrito
      addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const productId = this.getAttribute('data-product-id');
          fetch(`/api/carts/${cartId}/products/${productId}`, {
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
    })
    .catch(error => console.error(error));
});