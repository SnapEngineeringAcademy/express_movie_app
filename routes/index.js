const express = require('express');
const router = express.Router();

const firebase = require('../config/firebase')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Movie App', error: req.app.locals.err });
});

router.get('/signin', (req, res) => {
  res.render('signin/index', {
    error: req.app.locals.err
  })
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body
  req.app.locals.err = ""
  firebase.doSignInWithEmailAndPassword(email, password)
    .then(authUser => {
      console.log(authUser)
      res.redirect(`/users/${authUser.user.uid}`)
    })
    .catch(err => {
      req.app.locals.err = err.message
      res.redirect('/signin')
    })
})

router.post('/signup', (req, res) => {
  req.app.locals.err = ""
  firebase.doCreateUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(authUser => {
      console.log(authUser.user.uid)
      firebase.doCreateUser(authUser.user.uid, {
        email: req.body.email,
        username: req.body.username
      }).then(snapShot => {
        res.redirect(`/users/${authUser.user.uid}`)
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      req.app.locals.err = err.message
      res.redirect('/')
    })
})

router.get('/users/:id', async (req, res) => {
  const user = await firebase.doGetUser(req.params.id)
  console.log(user.data())
  res.render('users/show', {
    user: user.data()
  })
})

module.exports = router;
