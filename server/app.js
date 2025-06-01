require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

// Custom CORS middleware to ensure proper headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allowed headers
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Use the cors middleware as a fallback
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '50mb' }));

// Connect to Database
connectDB();

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Placeholder for Auth routes
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/admin/blogs', require('./routes/blogRoutes'));
app.use('/api/admin/contacts', require('./routes/contactRoutes'));
app.use('/api/admin/logos', require('./routes/logoRoutes'));
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin/services', require('./routes/serviceRoutes'));
app.use('/api/admin/hero', require('./routes/heroRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));