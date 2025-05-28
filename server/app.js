require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Placeholder for Auth routes
app.use('/api/auth', require('./routes/authRoutes')); 

// Placeholder for Admin routes (will be more specific later)
app.use('/api/admin/blogs', require('./routes/blogRoutes'));
app.use('/api/admin/contacts', require('./routes/contactRoutes'));
app.use('/api/admin/logos', require('./routes/logoRoutes'));
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin/services', require('./routes/serviceRoutes'));
app.use('/api/admin/hero', require('./routes/heroRoutes'));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 