const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'username minimal 3 karakter'],
  },
  // select: false -> hash tidak ikut terbaca kecuali diminta dengan .select('+password')
  password: { type: String, required: true, select: false },
    // Peran pengguna: register selalu menghasilkan 'user'
  role: {
    type: String,
    enum: { values: ['user', 'admin'], message: "role hanya boleh 'user' atau 'admin'" },
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);