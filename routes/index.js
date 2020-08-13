const express = require('express');
const router = express.Router();

const firebase = require('../config/firebase');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Movie App',
    error: req.app.locals.err,
  });
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/users/${req.session.user.uid}`);
  }
  res.render('login/index', {
    error: req.app.locals.err,
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  req.app.locals.err = '';
  firebase
    .doSignInWithEmailAndPassword(email, password)
    .then((authUser) => {
      req.session.user = {
        uid: authUser.user.uid,
        email: email,
      };

      res.redirect(`/users/${authUser.user.uid}`);
    })
    .catch((err) => {
      req.app.locals.err = err.message;
      res.redirect('/login');
    });
});

router.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/users/${req.session.user.uid}`);
  }
  res.render('signup/index', {
    error: req.app.locals.err,
  });
});

router.post('/signup', (req, res) => {
  req.app.locals.err = '';
  firebase
    .doCreateUserWithEmailAndPassword(
      req.body.email,
      req.body.password,
    )
    .then((authUser) => {
      firebase
        .doCreateUser(authUser.user.uid, {
          email: req.body.email,
          username: req.body.username,
        })
        .then((snapShot) => {
          req.session.user = {
            email: req.body.email,
            uid: authUser.user.uid,
          };
          res.redirect(`/users/${authUser.user.uid}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      req.app.locals.err = err.message;
      res.redirect('/signup');
    });
});

router.get('/users/:id', async (req, res) => {
  const user = await (await firebase.doGetUser(req.params.id)).data();
  console.log(req.session.user);
  res.render('users/show', {
    user: user,
  });
});

module.exports = router;
