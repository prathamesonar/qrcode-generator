import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import qrcode from 'qrcode';
import QRCodeModel from './models/QRCode.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected || !process.env.MONGODB_URI) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate QR Code as Data URI
    const imageUrl = await qrcode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Save to DB if connected
    await connectDB();
    let savedRecord = null;
    if (isConnected) {
      savedRecord = await QRCodeModel.create({ text, imageUrl });
    }

    res.json({ imageUrl, record: savedRecord });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    await connectDB();
    if (!isConnected) {
      return res.json([]);
    }
    const history = await QRCodeModel.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
