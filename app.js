const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cors = require('cors')
require('dotenv').config()


global.__basedir = __dirname

//require the routes
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const memberRoutes = require('./routes/member')

//connection with database
// mongoose.connect('mongodb://localhost:27017/membership', {
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  // useCreateIndex:true,
  // useUnifiedTopology: true,
  // useFindAndModify:false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
  console.log('Database Connected')
})

//create an express application
const app = express()

//enable file upload
app.use(fileUpload({ createParentPath: true }))

app.use(express.json())

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}
app.use(session(sessionConfig))
app.use(flash())

app.use(cors())
app.use(cookieParser())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

//middleware to use the routes
app.use('/app/admin', adminRoutes)
app.use('/app/auth', authRoutes)
app.use('/app/member', memberRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('*', (req, res) => {
  res.render('404')
})

let port = process.env.PORT

if (port == null || port == '') {
  port = 3000
}

app.listen(port, () => {
  console.log('Server started on port ' + port)
})
