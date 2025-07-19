import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoute.js';
import bookRoutes from './routes/BookRoute.js';
import reviewRoutes from './routes/reviewRoute.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ CORS setup for REST & Socket.io
const allowedOrigins = ['https://gravity-six-theta.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins[0],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io); // make io available in controllers

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
