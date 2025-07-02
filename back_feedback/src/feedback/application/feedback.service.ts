import { Injectable, Inject, ForbiddenException } from "@nestjs/common";
import { IFeedbackRepository } from "../domain/feedback.repository";
import { IProjectRepository } from "../../project/domain/project.repository";
import { CreateFeedbackDto } from "../../types/feedback.type";

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(IFeedbackRepository)
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const project = await this.projectRepository.findById(
      createFeedbackDto.projectId,
    );
    if (!project) {
      throw new ForbiddenException("Project not found");
    }
    return this.feedbackRepository.createFeedback(createFeedbackDto);
  }

  async getFeedbacksByProjectId(projectId: string, userId: bigint) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ForbiddenException("Project not found");
    }
    if (project.userId !== userId) {
      throw new ForbiddenException(
        "You are not authorized to view these feedbacks",
      );
    }
    return this.feedbackRepository.findFeedbacksByProjectId(projectId);
  }

  async deleteFeedback(id: number, userId: bigint) {
    const feedback = await this.feedbackRepository.findFeedbackById(id);
    if (!feedback) {
      throw new ForbiddenException("Feedback not found");
    }

    const project = await this.projectRepository.findById(feedback.projectId);
    // This check is belt-and-suspenders, as a feedback can't exist without a project
    // due to DB constraints, but good for robustness.
    if (!project) {
      throw new ForbiddenException("Project not found");
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        "You are not authorized to delete this feedback",
      );
    }

    await this.feedbackRepository.deleteFeedback(id);
  }
}
