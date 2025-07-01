import { Module } from "@nestjs/common";
import { UserController } from "./interface/user.controller";
import { UserService } from "./application/user.service";
import { UserPrismaRepository } from "./infrastructure/user.prisma.repository";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: "IUserRepository",
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService, "IUserRepository"],
})
export class UserModule {}
