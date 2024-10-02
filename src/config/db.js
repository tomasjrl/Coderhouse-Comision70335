import mongoose from 'mongoose';

const DB_URL = 'mongodb://localhost:27017/e-commerce';

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error(error);
});

db.once('open', () => {
  console.log('Conectado a MongoDB');
});