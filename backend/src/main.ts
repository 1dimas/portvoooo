import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for Next.js frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['POST', 'GET'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🤖 AI Backend running on http://localhost:${port}`);
}
bootstrap();
