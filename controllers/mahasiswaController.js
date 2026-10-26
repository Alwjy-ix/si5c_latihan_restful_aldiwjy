// const mahasiswaModel = require('../models/mahasiswaModel');
// const { errorHttp } = require('../middlewares/errorHandler');

// exports.getAll = (req, res) => {
//   const { jurusan } = req.query;
//   res.json(mahasiswaModel.getAll(jurusan));
// };

// exports.getById = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   const data = mahasiswaModel.getById(id);
//   if (!data) return next(errorHttp(404, 'Data tidak ditemukan'));
//   res.json(data);
// };

// exports.create = (req, res, next) => {
//   const { nama, jurusan } = req.body;
//   if (!nama || !jurusan) return next(errorHttp(400, 'nama dan jurusan wajib diisi'));

//   const baru = mahasiswaModel.create({ nama, jurusan });
//   res.status(201).json(baru);
// };

// exports.update = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   const hasil = mahasiswaModel.update(id, req.body);
//   if (!hasil) return next(errorHttp(404, 'Data tidak ditemukan'));
//   res.json(hasil);
// };

// exports.remove = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   const berhasil = mahasiswaModel.remove(id);
//   if (!berhasil) return next(errorHttp(404, 'Data tidak ditemukan'));
//   res.status(204).send();
// };

const Mahasiswa = require('../models/mahasiswaModel');
const Prodi = require('../models/prodiModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['nama', 'nim', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.create(req.body);
    res.status(201).json(mahasiswa);
  } catch (err) {
    res.status(400).json({ message: err.message }); 
  }
};

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }
  if (req.query.prodi) {
    const prodi = await Prodi.findOne({ kode: String(req.query.prodi).toUpperCase() });
    // Kode prodi tidak dikenal -> hasil kosong ($in: [] tidak cocok dengan apa pun)
    filter.prodiId = prodi ? prodi._id : { $in: [] };
  }

  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);
  
  // Sorting: ?sort=nama (naik) atau ?sort=-nama (turun). Bawaan: terbaru dulu
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  const [data, total] = await Promise.all([
    Mahasiswa.find(filter)
      .populate('prodiId', 'kode nama')
      .sort({ [sortField]: arah, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Mahasiswa.countDocuments(filter),
  ]);
  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};


exports.getById = async (req, res) => {
  const data = await Mahasiswa.findById(req.params.id).populate('prodiId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await Mahasiswa.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Mahasiswa.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};