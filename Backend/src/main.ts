import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express'
@Injectable()
export class VersionHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // When the request is HTTP
   if (context.getType() === 'http') {
    const http = context.switchToHttp();
      const response: Response = http.getResponse();
      response.setHeader('Access-Control-Allow-Origin', 'http://10.12.3.2:3000');
      response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return next.handle();
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('Transcendence API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

app.useGlobalInterceptors(new VersionHeaderInterceptor());
app.enableCors({
  origin: 'http://10.12.3.2:3000',
  methods: ["GET", "PATCH" , "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["cookie", "Cookie", "authorization", "Authorization", "content-type"],
  exposedHeaders: ["cookie", "Cookie", "authorization", "Authorization", "content-type"],
});
// app.enableCors({
//   credentials: true,
//   origin: true,
// });
app.useGlobalPipes(new ValidationPipe());
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(5000);
}
bootstrap();
