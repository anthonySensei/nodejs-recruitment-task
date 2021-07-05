import axios from 'axios';
import {Request, Response} from 'express';
import Movie from '../models/movie';

export const getMovies = async (req: Request, res: Response) => {
  const { user } = res.locals;

  try {
    const movies = await Movie.find({ userId: user.userId });
    res.send({
      movies: movies.map((movie: any) => (({userId, __v, createdAt, updatedAt, ...movieInfo}) => movieInfo)(movie.toJSON()))
    });
  } catch (err) {
    console.error(`Error fetching movies: ${err.message}`);
    res.send(500).send({ message: 'Error occurred' });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { user } = res.locals;

  if (!title) {
    return res.status(400).send({ message: 'Title is empty.' });
  }

  let movie;

  try {
    const { data } = await axios.get(`http://www.omdbapi.com?apikey=${process.env.OMDB_API_KEY}&t=${title}`);
    movie = (({Title, Released, Genre, Director}) => ({
      title: Title, release: new Date(Released), genre: Genre, director: Director
    }))(data);
  } catch (err) {
    console.error(`Cannot fetch movie (${title}) info: ${err.message}`);
    return res.status(500).send({ message: `Error occurred: ${err.message}` });
  }

  try {
    const isMovieAlreadyAdded = !!(await Movie.findOne({ title: movie.title, userId: user.userId }));

    if (isMovieAlreadyAdded) {
      return res.status(409).send({ message: `You have already added movie with title '${movie.title}'` });
    }
  } catch (err) {
    console.error(`Error finding movie: ${err.message}`);
    return res.status(500).send({ message: `Error occurred: ${err.message}` });
  }

  if (!movie || !movie?.title) {
    return res.status(404).send({ message: `Cannot find movie with this title: ${title}` });
  }

  try {
    await Movie.create({ ...movie, userId: user.userId });
    res.status(201).send({ message: `Movie '${title}' has been successfully added` });
  } catch (err) {
    console.error(`Error creating movie: ${err.message}`);
    res.status(500).send({ message: 'Cannot create movie' });
  }
};
