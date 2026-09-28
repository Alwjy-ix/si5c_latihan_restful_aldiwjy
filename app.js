require('dotenv').config(); // baris pertama
const express = require("express"); // import express
const cors = require('cors');
const app = express(); // instansiasi
const PORT = process.env.PORT || 3000; // PORT yang akan digunakan

function logger(req, res, next) {
  const waktu = new Date().toISOString();
  console.log(`[${waktu}] ${req.method} ${req.url}`);
  next(); // wajib, agar request lanjut ke handler berikutnya
}

// Didaftarkan sebelum route agar mencatat seluruh request
app.use(logger);
app.use(cors({// cors dimasukkan
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());
// Data sementara (disimpan di memori, hilang saat server restart)
let mahasiswa = [
  { id: 1, nama: "Andi", jurusan: "Sistem Informasi" },
  { id: 2, nama: "Budi", jurusan: "Informatika" },
];
let nextId = 3; // penghitung id untuk data baru

// route /
app.get("/", (req, res) => {
  res.send("Server Express.js berjalan!");
});

// GET /mahasiswa -> seluruh data, bisa difilter: /mahasiswa?jurusan=Informatika
app.get("/mahasiswa", (req, res) => {
  const { jurusan } = req.query;

  if (jurusan) {
    const hasil = mahasiswa.filter((m) => m.jurusan === jurusan);
    return res.json(hasil);
  }

  res.json(mahasiswa);
});

// GET /mahasiswa/:id -> menampilkan satu data berdasarkan id
app.get("/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = mahasiswa.find((m) => m.id === id);

  if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json(data);
});

// POST /mahasiswa
// Body: { "nama": "Citra", "jurusan": "Sistem Informasi" }
app.post("/mahasiswa", (req, res) => {
  const { nama, jurusan } = req.body;

  if (!nama || !jurusan) {
    return res.status(400).json({ message: "nama dan jurusan wajib diisi" });
  }

  const baru = { id: nextId++, nama, jurusan };

  mahasiswa.push(baru);
  res.status(201).json(baru);
});

// PUT /mahasiswa/2
// Body: { "nama": "Budi Santoso", "jurusan": "Informatika" }
app.put("/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  mahasiswa[index] = { ...mahasiswa[index], ...req.body, id };
  res.json(mahasiswa[index]);
});

// DELETE /mahasiswa/2
app.delete("/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  mahasiswa.splice(index, 1);
  res.status(204).send();
});

// menjalankan aplikasi pada port 3000
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
