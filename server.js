const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Carregar variaveis de ambiente
dotenv.config({ path: './config/config.env' });

// Conectando ao Banco de dados
connectDB();

// Arquivos de rotas
const alunos = require('./routes/alunos');

const app = express();

// Logger se estiver rodando em modo desenvolvimento
if (process.env.NODE_ENV === 'desenvolvimento') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Montando rotas
app.use('/api/v1/alunos', alunos);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`.blue
      .bold
  )
);

// Capturando com unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Fechar servidor e sair com falha
  server.close(() => process.exit(1));
});
