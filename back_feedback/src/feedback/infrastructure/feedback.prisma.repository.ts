import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IFeedbackRepository } from "../domain/feedback.repository";
import { Feedback } from "../domain/feedback.entity";

@Injectable()
export class FeedbackPrismaRepository implements IFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFeedback(feedback: {
    message: string;
    projectId: string;
  }): Promise<Feedback> {
    const newFeedback = await this.prisma.feedback.create({
      data: feedback,
    });
    return new Feedback(newFeedback);
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.prisma.feedback.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
