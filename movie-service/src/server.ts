import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import connectToMongoDB from './config/db';
import swagger from './config/api-docs';
import cors from './config/cors';

import router from './routes/index';

const app = express();
const { APP_PORT, MOVIE_SVC_PORT } = process.env;
const port = APP_PORT || MOVIE_SVC_PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors);
app.use('/api/v0/', router);
app.use('/api/v0/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.listen(port, async () => {
    console.log(`Movie service is listening on ${port}`);

    try {
        await connectToMongoDB();
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error(`Error connecting to mongoDb: ${err.message}`);
    }
});


export default app;
