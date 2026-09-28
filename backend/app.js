const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // Let's use morgan for logging, though we didn't install it, we'll keep it simple for now without it if not installed
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Global Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads

// Base route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
