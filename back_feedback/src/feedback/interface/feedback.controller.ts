import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
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
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByProjectId(
    @Query("projectId") projectId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    return this.feedbackService.getFeedbacksByProjectId(projectId, user.id);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    return this.feedbackService.deleteFeedback(id, user.id);
  }
}
