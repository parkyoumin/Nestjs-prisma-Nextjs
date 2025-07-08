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

  async getFeedbacksByProject(data: {
    projectId: string;
    page: number;
    pageSize: number;
  }): Promise<{ feedbacks: Feedback[]; total: number }> {
    const { projectId, page, pageSize } = data;
    const skip = (page - 1) * pageSize;

    const [total, feedbacks] = await this.prisma.$transaction([
      this.prisma.feedback.count({
        where: { projectId, deletedAt: null },
      }),
      this.prisma.feedback.findMany({
        where: { projectId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: pageSize,
      }),
    ]);

    return {
      total,
      feedbacks: feedbacks.map((f) => new Feedback(f)),
    };
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.prisma.feedback.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
