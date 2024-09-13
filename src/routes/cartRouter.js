import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Ruta de carts funciona correctamente');
});

export default router;