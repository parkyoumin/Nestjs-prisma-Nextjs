import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

// BigInt를 JSON으로 직렬화할 수 있도록 설정
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3002",
    credentials: true,
    exposedHeaders: ["Access-Token", "Refresh-Token-Invalid", "Role"],
  });
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
