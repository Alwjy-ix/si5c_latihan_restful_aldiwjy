// let prodi = [
//   { id: 1, nama: 'Sistem Informasi', jenjang: 'S1', fakultasId: 1 },
//   { id: 2, nama: 'Informatika', jenjang: 'S1', fakultasId: 1 },
// ];
// let nextId = 3;

// function getAll(fakultasId) {
//   if (fakultasId) return prodi.filter((p) => p.fakultasId === fakultasId);
//   return prodi;
// }

// function getById(id) {
//   return prodi.find((p) => p.id === id);
// }

// function create(data) {
//   const baru = { id: nextId++, ...data };
//   prodi.push(baru);
//   return baru;
// }

// module.exports = { getAll, getById, create };

const mongoose = require('mongoose');

const prodiSchema = new mongoose.Schema({
  kode: { type: String, required: [true, 'kode wajib diisi'], unique: true, trim: true, uppercase: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
});

module.exports = mongoose.model('Prodi', prodiSchema);