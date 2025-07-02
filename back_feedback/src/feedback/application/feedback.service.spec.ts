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
        findFeedbacksByProjectId: jest.fn(),
        findFeedbackById: jest.fn(),
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

  describe("getFeedbacksByProjectId", () => {
    it("should return feedbacks if user is project owner", async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockFeedbackRepository.findFeedbacksByProjectId.mockResolvedValue([
        mockFeedback,
      ]);

      const result = await service.getFeedbacksByProjectId(
        "test-project-id",
        BigInt(1),
      );

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        "test-project-id",
      );
      expect(result).toEqual([mockFeedback]);
    });

    it("should throw ForbiddenException if user is not project owner", async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      await expect(
        service.getFeedbacksByProjectId("test-project-id", BigInt(2)),
      ).rejects.toThrow(
        new ForbiddenException(
          "You are not authorized to view these feedbacks",
        ),
      );
    });
  });

  describe("deleteFeedback", () => {
    it("should delete feedback if user is project owner", async () => {
      // This is a bit tricky since our domain entity doesn't have a `project` property.
      // The service will need to fetch both. Let's adjust the mock.
      mockFeedbackRepository.findFeedbackById.mockResolvedValue(mockFeedback);
      mockProjectRepository.findById.mockResolvedValue(mockProject); // Service will fetch project to check owner

      await service.deleteFeedback(1, BigInt(1));

      expect(mockFeedbackRepository.findFeedbackById).toHaveBeenCalledWith(1);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        mockFeedback.projectId,
      );
      expect(mockFeedbackRepository.deleteFeedback).toHaveBeenCalledWith(1);
    });

    it("should throw ForbiddenException if feedback not found", async () => {
      mockFeedbackRepository.findFeedbackById.mockResolvedValue(null);

      await expect(service.deleteFeedback(999, BigInt(1))).rejects.toThrow(
        new ForbiddenException("Feedback not found"),
      );
    });

    it("should throw ForbiddenException if user is not project owner", async () => {
      mockFeedbackRepository.findFeedbackById.mockResolvedValue(mockFeedback);
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      await expect(service.deleteFeedback(1, BigInt(2))).rejects.toThrow(
        new ForbiddenException(
          "You are not authorized to delete this feedback",
        ),
      );
    });
  });
});
