import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // TODO : env
  app.enableCors({
    origin: "http://localhost:3002",
    credentials: true,
    exposedHeaders: ["Access-Token", "Refresh-Token-Invalid", "Role"],
  });
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
