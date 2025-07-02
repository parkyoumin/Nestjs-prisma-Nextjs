import { Module } from "@nestjs/common";
import { FeedbackService } from "./application/feedback.service";
import { FeedbackController } from "./interface/feedback.controller";
import { IFeedbackRepository } from "./domain/feedback.repository";
import { FeedbackPrismaRepository } from "./infrastructure/feedback.prisma.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { IProjectRepository } from "../project/domain/project.repository";
import { ProjectPrismaRepository } from "../project/infrastructure/project.prisma.repository";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    {
      provide: IFeedbackRepository,
      useClass: FeedbackPrismaRepository,
    },
    // FeedbackService depends on IProjectRepository, so it must be provided.
    {
      provide: IProjectRepository,
      useClass: ProjectPrismaRepository,
    },
  ],
})
export class FeedbackModule {}
