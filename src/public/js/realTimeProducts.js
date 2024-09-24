document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const productForm = document.getElementById("productForm");
  const productsList = document.getElementById("productsList");

  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const addProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
    };

    socket.emit("addProduct", addProduct);

    productForm.reset();
  });

  productsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("submit-btn-delete")) {
      const productId = event.target.getAttribute("data-id");
      socket.emit("deleteProduct", parseInt(productId));
    }
  });

  socket.on("products", (products) => {
    productsList.innerHTML = "";
    products.forEach((product) => {
      const productItem = document.createElement("li");
      productItem.className = "product";
      productItem.setAttribute("id", `product-${product.id}`);
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
        <button type="button" class="submit-btn-delete" data-id="${product.id}">Eliminar</button>
      `;
      productsList.appendChild(productItem);
    });
  });

  socket.emit("getProducts");
});
