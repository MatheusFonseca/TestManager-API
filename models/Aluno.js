const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor adicione um nome'],
    unique: true,
    trim: true,
    maxlength: [50, 'Nome não pode ser maior que 50 caracteres'],
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Aluno', AlunoSchema);
