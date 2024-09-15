import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import { createServer } from 'http';
import router from './router';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const port = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json({ limit: '20kb' }));
app.use(helmet());
app.disable('x-powered-by');

app.use('/document/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/document', router);

createServer(app).listen({ port }, () => {
  console.log(`Documents microservice ready in port ${port}`);
});
