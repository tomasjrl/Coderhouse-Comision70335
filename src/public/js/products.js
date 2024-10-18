// products.js

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/products"); // Asegúrate de que esta ruta sea correcta
    if (!response.ok) throw new Error("Error al cargar productos");

    const products = await response.json();
    const productsList = document.querySelector(".products-list");
    
    // Limpiar la lista existente
    productsList.innerHTML = "";

    // Agregar productos a la lista
    products.forEach(product => {
      const productItem = document.createElement("li");
      productItem.classList.add("product");
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
      `;
      productsList.appendChild(productItem);
    });
  } catch (error) {
    console.error(error);
  }
});
