import express from "express";

const router = express.Router();

let food = [
  { name: "Hamburguesa", price: 100 },
  { name: "Banana", price: 20 },
  { name: "Soda", price: 40 },
  { name: "Ensalada", price: 120 },
  { name: "Pizza", price: 150 },
];

router.get("/", (req, res) => {
  let testUser = {
    name: "Hilda",
    last_name: "Martinez",
    role: "admin",
  };
  res.render("index", {
    user: testUser,
    style: "index.css",
    isAdmin: testUser.role === "admin",
    food,
  });
});

export default router;
