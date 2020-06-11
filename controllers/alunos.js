const Aluno = require('../models/Aluno');

// @desc    Buscar todos os alunos
// @route   GET /api/v1/alunos
// @access  Protegido
exports.getAlunos = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Mostrar todos os alunos' });
};

// @desc    Criar um alunos
// @route   GET /api/v1/alunos
// @access  Protegido
exports.createAluno = async (req, res, next) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.status(201).json({ success: true, data: aluno });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
