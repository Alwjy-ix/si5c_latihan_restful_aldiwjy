// let mahasiswa = [
//   { id: 1, nama: 'Andi', jurusan: 'Sistem Informasi' },
//   { id: 2, nama: 'Budi', jurusan: 'Informatika' },
// ];
// let nextId = 3;

// function getAll(jurusan) {
//   if (jurusan) return mahasiswa.filter((m) => m.jurusan === jurusan);
//   return mahasiswa;
// }

// function getById(id) {
//   return mahasiswa.find((m) => m.id === id);
// }

// function create(data) {
//   const baru = { id: nextId++, ...data };
//   mahasiswa.push(baru);
//   return baru;
// }

// function update(id, data) {
//   const index = mahasiswa.findIndex((m) => m.id === id);
//   if (index === -1) return null;
//   mahasiswa[index] = { ...mahasiswa[index], ...data, id };
//   return mahasiswa[index];
// }

// function remove(id) {
//   const index = mahasiswa.findIndex((m) => m.id === id);
//   if (index === -1) return false;
//   mahasiswa.splice(index, 1);
//   return true;
// }

// module.exports = { getAll, getById, create, update, remove };

const mongoose = require('mongoose');

const alamatSchema = new mongoose.Schema({
  jalan: String,
  kota: String,
}, { _id: false });

const mahasiswaSchema = new mongoose.Schema({
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  nim: { type: String, required: [true, 'nim wajib diisi'], unique: true, trim: true },
  alamat: alamatSchema, 
  prodiId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prodi' },
  createdAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);