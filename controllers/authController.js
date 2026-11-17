const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { errorHttp } = require('../middlewares/errorHandler');

const SALT_ROUNDS = 10;
const PASSWORD_MIN = 8;
const PASSWORD_MAKS_BYTE = 72; // batas bcrypt: karakter setelah byte ke-72 diabaikan

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
    throw errorHttp(400, `password wajib diisi, minimal ${PASSWORD_MIN} karakter`);
  }
  if (Buffer.byteLength(password) > PASSWORD_MAKS_BYTE) {
    throw errorHttp(400, `password maksimal ${PASSWORD_MAKS_BYTE} byte`);
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, password: hashed });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Harus berupa teks: mencegah objek seperti { "$ne": null } masuk ke kueri
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw errorHttp(400, 'username dan password wajib diisi');
  }

  const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+password');
  const cocok = user ? await bcrypt.compare(password, user.password) : false;
  // Pesan sama untuk "username tidak ada" dan "password salah"
  if (!cocok) throw errorHttp(401, 'Username atau password salah');

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  res.json({ token });
};

// Contoh endpoint yang membaca data pengguna dari token
exports.me = (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role, berlakuSampai: new Date(req.user.exp * 1000) });
};