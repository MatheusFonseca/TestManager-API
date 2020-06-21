const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Loading environment variables
dotenv.config({ path: './config/config.env' });

// Connecting to database
connectDB();

// Route files
const users = require('./routes/users');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const classrooms = require('./routes/classrooms.js');
const questions = require('./routes/questions.js');
const tests = require('./routes/tests.js');

const app = express();

// Logger if in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// Prevent xss attacks
app.use(xss());

// Enable CORS
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Mount routes
app.use('/api/v1/users', users);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/classrooms', classrooms);
app.use('/api/v1/questions', questions);
app.use('/api/v1/tests', tests);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit with failure
  server.close(() => process.exit(1));
});
