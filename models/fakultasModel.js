let fakultas = [
  { id: 1, nama: 'Fakultas Ilmu Komputer dan Rekayasa' },
  { id: 2, nama: 'Fakultas Ekonomi dan Bisnis' },
];
let nextId = 3;

function getAll() {
  return fakultas;
}

function getById(id) {
  return fakultas.find((f) => f.id === id);
}

function create(data) {
  const baru = { id: nextId++, ...data };
  fakultas.push(baru);
  return baru;
}

module.exports = { getAll, getById, create };