import express from 'express';
import logger from 'morgan';

import connectToMongoDB from './config/db';

import router from './routes/index';

const app = express();
const port = 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v0/', router);

app.listen(port, async () => {
    console.log(`Movie service is listening on ${port}`);

    try {
        await connectToMongoDB();
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error(`Error connecting to mongoDb: ${err.message}`);
    }
});
