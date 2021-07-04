import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

const movieSchema: Schema = new Schema({
  title: { type: String, required: true },
  release: String,
  genre: String,
  director: String,
  userId: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Movie', movieSchema);
