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
