const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes import
const registerRoute = require('./endpoints/register');
const loginRoute = require('./endpoints/login');
const todoRoute = require('./endpoints/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
  })
  .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error);
  });

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', todoRoute);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ToDo API çalışıyor!' });
});

// Server başlatma
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
