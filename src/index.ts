import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Application } from 'express';
import { createServer } from 'http';
import router from './router';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const whitelist = ['/'];
const options: cors.CorsOptions = {
  origin: whitelist,
};
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'production';

const app: Application = express();

app.use(express.json({ limit: '20kb' }));
app.use(helmet());

if (env === 'production') {
  app.use(cors(options));
}

if (env === 'development') {
  app.use(cors());
}

app.disable('x-powered-by');

app.use('/document/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', router);

createServer(app).listen({ port }, () => {
  console.log(`Documents microservice ready in port ${port}`);
});
