const path = require('path');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3030;

require('dotenv').config();

const firebase = require('./config/firebase')



const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride('_method'))
app.use(session({
  secret: "this is a random string secret",
  resave: false,
  saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.use('/', indexRouter);
app.use('/movies', moviesRouter);

app.listen(PORT, (err) =>
  console.log(`${err ? err : `running on PORT ${PORT}`}`),
);
