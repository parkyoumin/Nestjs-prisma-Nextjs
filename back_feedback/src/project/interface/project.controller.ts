import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProjectService } from "../application/project.service";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";
import { AuthenticatedRequest } from "src/types/auth.type";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

class CreateProjectBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}

class UpdateProjectBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}

@UseGuards(JwtAuthGuard)
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateProjectBody,
  ) {
    const { user } = req;
    const { title } = body;

    return this.projectService.createProject({
      title,
      userId: user.id,
    });
  }

  @Put(":id")
  async updateProject(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: UpdateProjectBody,
  ) {
    const { user } = req;
    const { title } = body;

    return this.projectService.updateProject(id, {
      title,
      userId: user.id,
    });
  }

  @Delete(":id")
  async deleteProject(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    const { user } = req;
    return this.projectService.deleteProject(id, user.id);
  }

  @Get(":id")
  async getProject(@Param("id") id: string) {
    return this.projectService.getProject(id);
  }

  @Get()
  async getProjects(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    return this.projectService.getProjects(user.id);
  }
}
