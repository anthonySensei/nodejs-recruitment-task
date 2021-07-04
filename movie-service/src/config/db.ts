import { connect } from 'mongoose';

type Env = 'production' | 'development' | 'test';

const env: Env = (process.env.NODE_ENV || 'development') as Env;
const uri = {
  production: 'mongodb://mongo:27017',
  development: 'mongodb://mongo:27017',
  test: 'mongodb://mongo:27017/movie_api_test',
  local: 'mongodb://localhost:27017/movie_api_test'
};

export default () => connect(uri[env], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

