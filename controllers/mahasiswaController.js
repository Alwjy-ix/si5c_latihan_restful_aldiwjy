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
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.create(req.body);
    res.status(201).json(mahasiswa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const data = await Mahasiswa.find().populate('prodiId');
  res.json(data);
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