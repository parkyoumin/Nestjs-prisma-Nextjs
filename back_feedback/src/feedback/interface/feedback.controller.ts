import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  Get,
  DefaultValuePipe,
} from "@nestjs/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { FeedbackService } from "../application/feedback.service";
import { CreateFeedbackDto } from "../../types/feedback.type";
import { JwtAuthGuard } from "../../auth/jwt/jwt.guard";
import { AuthenticatedRequest } from "../../types/auth.type";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback =
      await this.feedbackService.createFeedback(createFeedbackDto);
    return { createdId: feedback.id };
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get("project/:projectId")
  async getFeedbacksByProject(
    @Param("projectId") projectId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    return this.feedbackService.getFeedbacksByProject({
      projectId,
      userId: user.id,
      page,
      pageSize,
    });
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteFeedback(
    @Param("id", ParseIntPipe) id: number,
    @Query("projectId") projectId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    await this.feedbackService.deleteFeedback({
      id,
      projectId,
      userId: user.id,
    });
  }
}
