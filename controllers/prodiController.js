const prodiModel = require('../models/prodiModel');
const fakultasModel = require('../models/fakultasModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = (req, res) => {
  const fakultasId = req.query.fakultasId ? parseInt(req.query.fakultasId) : undefined;
  res.json(prodiModel.getAll(fakultasId));
};

exports.getById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = prodiModel.getById(id);
  if (!data) return next(errorHttp(404, 'Prodi tidak ditemukan'));
  res.json(data);
};

exports.create = (req, res, next) => {
  const { nama, jenjang, fakultasId } = req.body;
  if (!nama || !jenjang || !fakultasId) {
    return next(errorHttp(400, 'nama, jenjang, dan fakultasId wajib diisi'));
  }

  // Controller mengoordinasikan dua Model: memvalidasi relasi
  // sebelum data baru dibuat di prodiModel.
  const indukFakultas = fakultasModel.getById(parseInt(fakultasId));
  if (!indukFakultas) return next(errorHttp(400, 'fakultasId tidak ditemukan'));

  const baru = prodiModel.create({ nama, jenjang, fakultasId: parseInt(fakultasId) });
  res.status(201).json(baru);
};