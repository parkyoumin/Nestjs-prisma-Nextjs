import { Injectable, Inject, ForbiddenException } from "@nestjs/common";
import { IFeedbackRepository } from "../domain/feedback.repository";
import { IProjectRepository } from "../../project/domain/project.repository";
import {
  CreateFeedbackDto,
  DeleteFeedbackDto,
  GetFeedbacksByProjectDto,
} from "../../types/feedback.type";

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

  async getFeedbacksByProject(getFeedbacksDto: GetFeedbacksByProjectDto) {
    const { projectId, userId, page, pageSize } = getFeedbacksDto;
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new ForbiddenException("Project not found");
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        "You are not authorized to view these feedbacks",
      );
    }

    return this.feedbackRepository.getFeedbacksByProject({
      projectId,
      page,
      pageSize,
    });
  }

  async deleteFeedback(deleteFeedbackDto: DeleteFeedbackDto) {
    const project = await this.projectRepository.findById(
      deleteFeedbackDto.projectId,
    );

    if (!project) {
      throw new ForbiddenException("Project not found");
    }

    if (project.userId !== deleteFeedbackDto.userId) {
      throw new ForbiddenException(
        "You are not authorized to delete this feedback",
      );
    }

    await this.feedbackRepository.deleteFeedback(deleteFeedbackDto.id);
  }
}
