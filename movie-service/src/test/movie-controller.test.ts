import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server';

import {getToken, moviesList, users} from './mocks';

import Movie from '../models/movie';

chai.use(chaiHttp);

const expect = chai.expect;
const api = chai.request(app).keepOpen();
const basicToken = getToken('basic');
const premiumToken = getToken('premium');
const createMovie = (title: string, token: any) => api.post('/api/v0/movies').set('Authorization', token).send({ title });
const getMovie = (token: string) => api.get('/api/v0/movies').set('Authorization', token);

describe('Movie Controller', () => {
  before(() => Movie.deleteMany({}));

  describe('GET /api/v0/movies', () => {
    it('should return user movies. Should be equal 1', async  () => {
      await Promise.all([
        createMovie('Marvel', basicToken),
        createMovie('Marvel', premiumToken),
      ]);
      const res = await getMovie(basicToken);
      expect(res.body.movies?.length).to.be.equal(1);
    });
  });

  describe('POST /api/v0/movies', () => {
    it('should add movie',  async () => {
      const res = await createMovie('Marvel', basicToken);
      const movies = await Movie.find();
      expect(res.status).to.be.equal(201);
      expect(movies.length).to.be.equal(1);
    });

    it('should return 400 and error message if title is empty',  async () => {
      const res = await createMovie('', basicToken);
      expect(res.status).to.be.equal(400);
    });

    it('should return 400 and error message if movie with this title has been already added',  async () => {
      await createMovie('Marvel', basicToken);
      const res = await createMovie('Marvel', basicToken);
      expect(res.status).to.be.equal(409);
    });

    it('should return 404 and error message if movie was not found', async () => {
      const res = await createMovie('dsadasdASDasd', basicToken);
      expect(res.status).to.be.equal(404);
    });

    it('should return 500 and error message if OMDB API KEY is not provided',  async () => {
      process.env.OMDB_API_KEY = undefined;
      const res = await createMovie('Marvel', basicToken);
      expect(res.status).to.be.equal(500);
    });
  });

  afterEach(() => Movie.deleteMany({}));
  after(() => api.close());
});
