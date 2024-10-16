import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { globalErrorMiddleware, prismaErrorMiddleware } from './middleware';
import { router } from './routes';

const app = express();

const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', router);

app.use(prismaErrorMiddleware);
app.use(globalErrorMiddleware);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

startServer();

app.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Error: address already in use');
  } else {
    console.log(err);
  }
});
