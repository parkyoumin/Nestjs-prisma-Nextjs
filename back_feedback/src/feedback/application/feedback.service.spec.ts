import { Test, TestingModule } from "@nestjs/testing";
import { FeedbackService } from "./feedback.service";
import { IFeedbackRepository } from "../domain/feedback.repository";
import { IProjectRepository } from "../../project/domain/project.repository";
import { ForbiddenException } from "@nestjs/common";
import { Project } from "../../project/domain/project.entity";
import { Feedback } from "../domain/feedback.entity";

describe("FeedbackService", () => {
  let service: FeedbackService;
  let mockFeedbackRepository: jest.Mocked<IFeedbackRepository>;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;

  const mockProject = new Project({
    id: "test-project-id",
    title: "Test Project",
    userId: BigInt(1),
    createdAt: new Date(),
  });

  const mockFeedback = new Feedback({
    id: 1,
    message: "Test feedback",
    projectId: "test-project-id",
    createdAt: new Date(),
  });

  beforeEach(async () => {
    const mockFeedbackRepoProvider = {
      provide: IFeedbackRepository,
      useValue: {
        createFeedback: jest.fn(),
        deleteFeedback: jest.fn(),
      },
    };
    const mockProjectRepoProvider = {
      provide: IProjectRepository,
      useValue: {
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        mockFeedbackRepoProvider,
        mockProjectRepoProvider,
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    mockFeedbackRepository = module.get(IFeedbackRepository);
    mockProjectRepository = module.get(IProjectRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createFeedback", () => {
    it("should create feedback if project exists", async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockFeedbackRepository.createFeedback.mockResolvedValue(mockFeedback);

      const result = await service.createFeedback({
        message: "Test feedback",
        projectId: "test-project-id",
      });

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        "test-project-id",
      );
      expect(mockFeedbackRepository.createFeedback).toHaveBeenCalled();
      expect(result).toEqual(mockFeedback);
    });

    it("should throw ForbiddenException if project does not exist", async () => {
      mockProjectRepository.findById.mockResolvedValue(null);

      await expect(
        service.createFeedback({
          message: "Test feedback",
          projectId: "non-existent-id",
        }),
      ).rejects.toThrow(new ForbiddenException("Project not found"));
    });
  });

  describe("deleteFeedback", () => {
    it("should delete feedback if project exists", async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockFeedbackRepository.deleteFeedback.mockResolvedValue(undefined);

      await service.deleteFeedback({
        id: 1,
        projectId: "test-project-id",
        userId: BigInt(1),
      });

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        "test-project-id",
      );
      expect(mockFeedbackRepository.deleteFeedback).toHaveBeenCalled();
    });

    it("should throw ForbiddenException if project does not exist", async () => {
      mockProjectRepository.findById.mockResolvedValue(null);

      await expect(
        service.deleteFeedback({
          id: 1,
          projectId: "non-existent-id",
          userId: BigInt(1),
        }),
      ).rejects.toThrow(new ForbiddenException("Project not found"));
    });
  });
});
