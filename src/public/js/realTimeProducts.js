document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const productForm = document.getElementById("productForm");
  const productsList = document.getElementById("productsList");

  // Manejo del envío del formulario
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value === 'true'; // Asegúrate de obtener el valor de status

    const addProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
      status // Asegúrate de incluir status en el objeto addProduct
    };

    // Emitir evento para agregar producto
    socket.emit("addProduct", addProduct);
    
    // Resetear formulario
    productForm.reset();
  });

  // Manejo del clic en eliminar producto
  productsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("submit-btn-delete")) {
      const productId = event.target.getAttribute("data-id");
      socket.emit("deleteProduct", productId); // Cambié parseInt(productId) a productId
    }
  });

  // Escuchar evento 'products' para actualizar la lista
  socket.on("products", (products) => {
    productsList.innerHTML = ""; // Limpiar la lista existente
    products.forEach((product) => {
      const productItem = document.createElement("li");
      productItem.className = "product";
      productItem.setAttribute("id", `product-${product._id}`); // Usar _id si es MongoDB
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <h3>Descripción</h3>
        <p>${product.description}</p>
        <h3>Código: ${product.code}</h3>
        <h3>Precio: $${product.price}</h3> 
        <h3>Stock: ${product.stock}</h3> 
        <h3>Categoría:</h3> 
        <p>${product.category}</p>
        <button type="button" class="submit-btn-delete" data-id="${product._id}">Eliminar</button>
      `;
      productsList.appendChild(productItem);
    });
  });

  // Solicitar productos iniciales al cargar
  socket.emit("getProducts");
});