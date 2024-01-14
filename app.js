const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db')
const multer = require('multer');
const handlebarsHelpers = require('handlebars-helpers')();
const base64Helper = (data) => new handlebars.SafeString(data.toString('base64'));


// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Method overrides
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)


// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  editIcon1,
  select,
} = require('./helpers/hbs')

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      editIcon1,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// home render
app.get('/', function (req, res) {
  res.render('home', { layout: false });
});

// Routes News
app.get('/', (req, res) => {
  res.render('newspage', { title: "News Page" }, { layout: false });
});

// Routes Contact _ Us Page
app.get('/', (req, res) => {
  res.render('contact', { title: "Contact Page" }, { layout: false });
});

// Routes amirdetail Page
app.get('/', (req, res) => {
  res.render('amirdetail', { title: "Jema'a Amir" }, { layout: false });
});

// Routes students Page
app.get('/', (req, res) => {
  res.render('student', { title: "Student Page" }, { layout: false });
});

// Routes workers Page
app.get('/', (req, res) => {
  res.render('worker', { title: "Worker Page" }, { layout: false });
});

// Routes Problems Page
app.get('/', (req, res) => {
  res.render('problempage', { title: "Student Page" }, { layout: false });
});


// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
// The express.static middleware should be placed before other middleware or route handlers that might need to handle specific routes. 
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads', 'uploadsnews', 'uploadstudent')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/news', require('./routes/news'));
app.use('/home', require('./routes/home'))
app.use('/contact', require('./routes/contact'));
app.use('/amirdetail', require('./routes/amirdetail'));
app.use('/student', require('./routes/student'));
app.use('/worker', require('./routes/worker'));
app.use('/problem', require('./routes/problem'));


const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)