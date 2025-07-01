import { Module } from "@nestjs/common";
import { ProjectService } from "./application/project.service";
import { ProjectController } from "./interface/project.controller";
import { IProjectRepository } from "./domain/project.repository";
import { ProjectPrismaRepository } from "./infrastructure/project.prisma.repository";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: IProjectRepository,
      useClass: ProjectPrismaRepository,
    },
  ],
})
export class ProjectModule {}
