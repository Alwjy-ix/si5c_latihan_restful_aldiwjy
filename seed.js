// seed.js
// Mengisi basis data dengan 3 prodi dan 25 mahasiswa. Aman dijalankan berulang:
// data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Prodi = require('./models/prodiModel');
const Mahasiswa = require('./models/mahasiswaModel');

const NAMA = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gita', 'Hadi', 'Indra', 'Joko',
  'Kiki', 'Lina', 'Maya', 'Nanda', 'Oka', 'Putri', 'Qori', 'Rina', 'Sari', 'Tono',
  'Umar', 'Vina', 'Wawan', 'Yuni', 'Zaki'];
const KOTA = ['Palembang', 'Indralaya', 'Prabumulih', 'Lubuklinggau'];

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Mahasiswa.deleteMany({});
  await Prodi.deleteMany({});

  const prodi = await Prodi.insertMany([
    { kode: 'SI', nama: 'Sistem Informasi' },
    { kode: 'TI', nama: 'Teknik Informatika' },
    { kode: 'MI', nama: 'Manajemen Informatika' },
  ]);

  const mahasiswa = NAMA.map((nama, i) => ({
    nama,
    nim: String(2301001 + i),
    alamat: { jalan: `Jl. Contoh No. ${i + 1}`, kota: KOTA[i % KOTA.length] },
    prodiId: prodi[i % 3]._id, // SI, TI, MI bergantian
  }));
  await Mahasiswa.insertMany(mahasiswa);

  console.log(`Seed selesai: ${prodi.length} prodi, ${mahasiswa.length} mahasiswa`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err.message); process.exit(1); });