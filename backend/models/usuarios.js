const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente',
    required: true
  }
}, {
  timestamps: true
});

// Middleware para encriptar el password antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


module.exports = mongoose.model('Usuario', usuarioSchema);
