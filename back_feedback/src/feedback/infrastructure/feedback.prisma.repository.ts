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

  async findFeedbacksByProjectId(projectId: string): Promise<Feedback[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: { projectId, deletedAt: null },
      orderBy: {
        createdAt: "desc",
      },
    });
    return feedbacks.map((feedback) => new Feedback(feedback));
  }

  async findFeedbackById(id: number): Promise<Feedback | null> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id, deletedAt: null },
    });
    return feedback ? new Feedback(feedback) : null;
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.prisma.feedback.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
