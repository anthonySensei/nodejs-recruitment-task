import { connect } from 'mongoose';

export default () => connect('mongodb://mongo:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

