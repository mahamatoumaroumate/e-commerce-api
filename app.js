// app.js
require('dotenv').config();
require('express-async-errors');
const helmet=require('helmet')
const rateLimiter=require('express-rate-limit')
const xss=require('xss-clean')
const mongoSanitize=require('express-mongo-sanitize')
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
const webhookHandler = require('./routes/webhookRoute');
const notFoundMiddleware = require('./middlewares/NotFound');
const errorHandlerMiddleware = require('./middlewares/error-handler');

const app = express();

// —––––––––––––––––––––––––––––––––––––––––––––
//  Stripe webhook MUST come before express.json()
//  so that bodyParser.raw() sees the unparsed body
// —––––––––––––––––––––––––––––––––––––––––––––
app.use(
  '/api/v1/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),  // <— this gives req.body as Buffer
  webhookHandler
);
app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs:15 * 60 *1000,
  max:60
}))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
// now all other routes can use express.json()
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true, // 🔥 allow credentials (cookies, headers)
}));
app.use(morgan('tiny'));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// your normal REST routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/orders', orderRoute);

// a simple health-check
app.get('/', (req, res) => res.send('hello api user'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
(async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => console.log(`Server is up on ${port}`));
})();
