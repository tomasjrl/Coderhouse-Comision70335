import { getAllProducts } from "./productManager/getAllProducts.js";
import { getProduct } from "./productManager/getProduct.js";
import {
  createProduct,
  createProductForSocket,
} from "./productManager/createProduct.js";
import { updateProduct } from "./productManager/updateProduct.js";
import {
  deleteProduct,
  deleteProductForSocket,
} from "./productManager/deleteProduct.js";

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductForSocket,
  createProductForSocket,
};
