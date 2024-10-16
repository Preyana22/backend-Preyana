import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import cors from "cors-ts";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "http://localhost:3001",
        "http://localhost:3002",
        "http://52.14.78.149",
        "http://192.168.1.92:3001",
        "http://preyana.com",
      ],
      optionsSuccessStatus: 200,
    })
  );
  await app.listen(3000);
}
bootstrap();
