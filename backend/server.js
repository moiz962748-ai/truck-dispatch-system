const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const loadRoutes = require('./routes/load');
const { authMiddleware } = require('./middleware/authMiddleware');
const { getDrivers } = require('./controllers/driverController');
const { getLoads, getMyLoads } = require('./controllers/loadController');

// .env file load kar raha hai
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Truck Dispatch System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/loads', loadRoutes);
app.get('/api/loads', authMiddleware, getLoads);
app.get('/api/loads/my-loads', authMiddleware, getMyLoads);
app.get('/api/loads/drivers', authMiddleware, getDrivers);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Options (useNewUrlParser, useUnifiedTopology) ko remove kar diya hai
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to MongoDB Successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();