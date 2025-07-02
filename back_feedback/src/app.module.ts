import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { FeedbackModule } from "./feedback/feedback.module";

@Module({
  imports: [UserModule, AuthModule, ProjectModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
