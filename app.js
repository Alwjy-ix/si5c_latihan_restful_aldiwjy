require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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


// Import handler & routes
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const fakultasRoutes = require('./routes/fakultasRoutes');
const prodiRoutes = require('./routes/prodiRoutes');
const authRoutes = require('./routes/authRoutes');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET belum diisi di .env');
  process.exit(1);
}
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json()); // Cukup sekali di sini

// Express 5: req.body bernilai undefined bila request tidak membawa body JSON
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

// ---------- Route Utama ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});


app.use('/mahasiswa', mahasiswaRoutes);
app.use('/fakultas', fakultasRoutes);
app.use('/prodi', prodiRoutes);
app.use('/auth', authRoutes);  

// ---------- Error Handler (Wajib Paling Bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Koneksi Database & Server ----------
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung ke MongoDB:', err.message);
    process.exit(1);
  });

// npm install express mongoose dotenv cors