const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'https://amazon-clone-rho-ebon.vercel.app',
  credentials: true
  }));
  
app.use(express.json());

// Establish Database link
connectDB();

// API Mounting Entry points
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/users', require('./routes/user'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Amazon Clone Backend Engine firing on port ${PORT}`));