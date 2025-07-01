import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import { GoogleStrategy } from "./oauth/google.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ global: true }),
    PassportModule.register({ defaultStrategy: "google" }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
