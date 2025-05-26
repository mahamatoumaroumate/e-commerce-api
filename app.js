// app.js
require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/connectDB');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const reviewRoute = require('./routes/reviewRoute');
const orderRoute = require('./routes/orderRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const webhookHandler = require('./routes/webhookRoute');
const notFoundMiddleware = require('./middlewares/NotFound');
const errorHandlerMiddleware = require('./middlewares/error-handler');

const app = express();

// Stripe webhook must come before express.json()
app.use(
  '/api/v1/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  webhookHandler
);

app.set('trust proxy', 1);

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
}));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// ✅ Proper CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://e-commerce-admin-dashboar.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Handle OPTIONS preflight
app.options('*', cors());
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
app.use(express.json());
app.use(morgan('tiny'));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// REST API routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/favorites',favoriteRoute)

// Health check
app.get('/', (req, res) => res.send('hello api user'));

// Error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server start
const port = process.env.PORT || 3000;
(async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => console.log(`Server is up on ${port}`));
})();
