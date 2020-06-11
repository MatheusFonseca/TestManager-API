const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Loading environment variables
dotenv.config({ path: './config/config.env' });

// Connecting to database
connectDB();

// Route files
const users = require('./routes/users');

const app = express();

// Logger if in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Mount routes
app.use('/api/v1/alunos', alunos);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`.blue
      .bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit with failure
  server.close(() => process.exit(1));
});
