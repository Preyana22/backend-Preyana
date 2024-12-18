import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import cors from "cors-ts";
import * as fs from "fs";
import * as https from "https";

async function bootstrap() {
  // Load SSL certificate files
  const httpsOptions = {
    key: fs.readFileSync("./certificates/private.key"), // Path to private key file
    cert: fs.readFileSync("./certificates/certificate.crt"), // Path to certificate file
    ca: fs.readFileSync("./certificates/ca_bundle.crt"), // Path to CA bundle if needed
  };

  // Create a Nest application with HTTPS options
  const app = await NestFactory.create(AppModule, {
    httpsOptions, // Pass HTTPS options here
  });

  // Apply middleware
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "http://localhost:3001",
        "http://localhost:3002",
        "http://52.14.78.149",
        "http://192.168.1.90:3001",
        "http://192.168.1.90",
        "http://preyana.com",
        "https://preyana.com",
        "https://www.preyana.com",
        "http://localhost",
      ],
      optionsSuccessStatus: 200,
    })
  );

  // Start listening on port 3000
  await app.listen(80);
}

bootstrap();
