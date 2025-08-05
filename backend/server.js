// const express = require('express');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const session = require('express-session');
// const path = require('path');
// const apiRouter = require('./routes/v1/index');
// require('./config/passport');

// const app = express();
// dotenv.config();

// const PORT = process.env.PORT || 8000;

// // CORS Configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Session Configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,
//     maxAge: 24 * 60 * 60 * 1000,
//     sameSite: 'none', // Add this for cross-domain
//     httpOnly: true,
//   },
//   name: "sessionID"
// }));

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Serve static files from 'views' directory
// app.use(express.static(path.join(__dirname, 'views')));

// // Landing page → login.html from views folder
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login.html'));
// });

// // API Routes
// app.use("/", apiRouter);

// // Start server
// const server = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');

//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1);
//   }
// };

// server();

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const apiRouter = require('./routes/v1/index');
const path = require('path'); // Added path for consistency

// Import passport configuration
require('./config/passport');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration with MongoStore - CORRECTED
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    sameSite: isProduction ? 'none' : 'lax', 
    secure: isProduction,                     
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  name: "sessionID"
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Passport session middleware active:', !!req.session.passport);
  next();
});

// Mount routes
app.use("/", apiRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'SkillSwap API is running' });
});




const server = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
server();