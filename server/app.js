const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Connect to MongoDB
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/contacts', require('./routes/contactRoutes'));
// Ensure the auth route is also defined if this server handles /api/auth/login
app.use('/api/auth', require('./routes/authRoutes')); // Add this line if authRoutes exists


// Placeholder for Admin routes (will be more specific later)
app.use('/api/admin/blogs', require('./routes/blogRoutes'));
app.use('/api/admin/contacts', require('./routes/contactRoutes'));
app.use('/api/admin/logos', require('./routes/logoRoutes'));
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/services', require('./routes/serviceRoutes'));
app.use('/api/admin/hero', require('./routes/heroRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));