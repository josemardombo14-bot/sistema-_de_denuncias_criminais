const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor forneça um nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor forneça um email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor forneça um email válido']
  },
  telefone: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: [true, 'Por favor forneça uma senha'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['cidadao', 'admin', 'policia'],
    default: 'cidadao'
  },
  localizacao: {
    latitude: Number,
    longitude: Number,
    endereco: String,
    cidade: String,
    provincia: String
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Encriptar senha antes de salvar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para comparar senhas
UsuarioSchema.methods.compararSenha = async function(senhaInserida) {
  return await bcrypt.compare(senhaInserida, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
