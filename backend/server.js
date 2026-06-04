const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve dynamically generated SVG product images (deterministic, labelled by brand/type/index)
app.get('/images/product/:brand/:type/:index.svg', (req, res) => {
  const { brand, type, index } = req.params;
  const bg = type.toLowerCase().includes('mouse') ? '#f3f4f6' : type.toLowerCase().includes('keyboard') ? '#eef2ff' : type.toLowerCase().includes('headphone') ? '#fff7ed' : '#ecfeff';
  const color = '#111827';
  const text = `${decodeURIComponent(brand)} ${decodeURIComponent(type)} ${index}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="100%" height="100%" fill="${bg}" />
    <g fill="${color}" font-family="Arial, Helvetica, sans-serif">
      <text x="50%" y="45%" font-size="24" dominant-baseline="middle" text-anchor="middle">${type}</text>
      <text x="50%" y="55%" font-size="18" dominant-baseline="middle" text-anchor="middle">${brand} • #${index}</text>
    </g>
  </svg>`;
  res.type('image/svg+xml');
  res.send(svg);
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI Smart Budget-Based Product Finder API is live.' });
});

app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MAX_TRIES = 5;

const startServer = (port, attempt = 1) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempt < MAX_TRIES) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Set a different PORT or free it and retry.`);
      console.error(`On Windows: run \`netstat -ano | findstr :${port}\` to find the PID, then \`taskkill /PID <pid> /F\`.`);
      console.error(`On macOS/Linux: run \`lsof -i :${port}\` to find the PID, then \`kill -9 <pid>\`.`);
      process.exit(1);
    }

    console.error(err);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT);
