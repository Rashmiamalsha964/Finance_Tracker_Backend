// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


connectDB();

const app = express();

app.use(cors()); // Allows frontend to make requests to the backend
app.use(express.json()); // Allows backend to parse JSON data in the request body

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Basic test route
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});