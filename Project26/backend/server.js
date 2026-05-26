require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDB = process.env.MONGO_DB || 'gift_list_db';
const mongoURI = `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    port: process.env.PORT
  });
});

app.use('/api/gifts', require('./routes/gifts'));
app.use('/api/recipients', require('./routes/recipients'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/history', require('./routes/history'));

const connectWithRetry = () => {
  console.log(`Connecting to MongoDB: ${mongoURI}`);
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  }).then(() => {
    console.log('MongoDB connected successfully');
  }).catch(err => {
    console.error('MongoDB connection error, retrying in 3s...', err.message);
    setTimeout(connectWithRetry, 3000);
  });
};

connectWithRetry();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gift list backend running on http://localhost:${PORT}`);
});
