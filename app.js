require('dotenv').config(); //05/10/2026

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   // tambahkan di antara require lainnya

const app = express();
const PORT = process.env.PORT || 3000;

function logger(req, res, next) {
  const waktu = new Date().toISOString();
  console.log(`[${waktu}] ${req.method} ${req.url}`);
  next();
}

function cekApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'API key tidak valid' });
  }

  next();
}

function errorHttp(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const fakultasRoutes = require('./routes/fakultasRoutes');
const prodiRoutes = require('./routes/prodiRoutes');   // bersama require lainnya


// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

// ---------- Route dasar ----------
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/fakultas', fakultasRoutes);
app.use('/prodi', prodiRoutes);                 
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});

// ---------- Route per modul ----------
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/fakultas', fakultasRoutes);
app.use('/prodi', prodiRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

app.use(notFoundHandler);
app.use(errorHandler);


mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung:', err.message);
    process.exit(1);
  });