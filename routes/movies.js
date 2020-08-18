const express = require('express');
const axios = require('axios');
const router = express.Router();

const firebase = require('../config/firebase')

/* GET movie listing. */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    );
    res.render('movies/index', {
      movies: response.data.results
    });
  } catch (err) {
    console.log(err);
  }
});

/* GET movie by id listing. */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data: movie } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    );
    const userMovie = await firebase.doGetMovie(id)
    const likes = userMovie.data() ? userMovie.data().likes : []
    console.log(likes)
    res.render('movies/show', {
      movie,
      likes
    });
  } catch (e) {
    console.log(e);
  }
});


router.post('/:id', (req, res) => {
  console.log(req.session)
  firebase
    .doLikeMovie(req.params.id, req.session.user.uid)
    .then((snapShot) => {
      res.redirect(`/movies/${req.params.id}`)
    });
});

router.delete('/:id', (req, res) => {
  console.log("hit")
  firebase
    .doUnlikeMovie(req.params.id, req.session.user.uid)
    .then((snapShot) => {
      res.redirect(`/movies/${req.params.id}`)
    });
});

module.exports = router;
