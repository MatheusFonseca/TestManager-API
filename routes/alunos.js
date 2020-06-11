const express = require('express');
const router = express.Router();

const { getAlunos, createAluno } = require('../controllers/alunos');

router.route('/').get(getAlunos).post(createAluno);

module.exports = router;
