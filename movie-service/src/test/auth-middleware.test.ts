import Movie from '../models/movie';

import chai from 'chai';
import chaiHttp from 'chai-http';

import {getInvalidToken, getToken, moviesList} from './mocks';
import app from '../server';

chai.use(chaiHttp);

const expect = chai.expect;
const api = chai.request(app).keepOpen();
const basicToken = getToken('basic');
const premiumToken = getToken('premium');
const createMovie = (title: string, token: any) => api.post('/api/v0/movies').set('Authorization', token).send({ title });
const getMovie = (token: string) => api.get('/api/v0/movies').set('Authorization', token);

describe('Auth Middlewares', () => {
  it('should return 401 if Authorization header is empty or not attached', async () => {
    const res = await api.get('/api/v0/movies');
    expect(res.status).to.be.equal(401);
  });

  it('should return 401 if token is expired',  async () => {
    const res = await getMovie(getInvalidToken('expiresIn'));
    expect(res.status).to.be.equal(401);
  });

  it('should return 401 if user role is invalid',  async () => {
    const res = await getMovie(getInvalidToken('userRole'));
    expect(res.status).to.be.equal(401);
  });

  it('should return 401 if token secret is incorrect',  async () => {
    const res = await getMovie(getInvalidToken('secret'));
    expect(res.status).to.be.equal(401);
  });

  it('should return 403 if basic user tries to add more than 5 books per calendar month',  async () => {
    await Promise.all(Array.from({length: 5}, (_, i) => createMovie(moviesList[i], basicToken)));
    const res = await createMovie('Football', basicToken);
    expect(res.status).to.be.equal(403);
  });

  it('should allow premium user to add more than 5 books per calendar month',  async () => {
    await Promise.all(Array.from({length: 5}, (_, i) => createMovie(moviesList[i], premiumToken)));
    const res = await createMovie('Football', premiumToken);
    expect(res.status).to.be.equal(201);
  });

  it('should authorize basic user', async () => {
    const res = await getMovie(basicToken);
    expect(res.status).to.be.equal(200);
  });

  it('should authorize premium user', async () => {
    const res = await getMovie(premiumToken);
    expect(res.status).to.be.equal(200);
  });

  afterEach(() => Movie.deleteMany({}));
  after(() => api.close());
});
