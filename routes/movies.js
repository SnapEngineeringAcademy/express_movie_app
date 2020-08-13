const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET movie listing. */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    );
    res.render('movies/index', {
      movies: response.data.results,
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
    res.render('movies/show', {
      movie,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
