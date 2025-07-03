import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "./project.service";
import { IProjectRepository } from "../domain/project.repository";
import { Project } from "../domain/project.entity";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: jest.Mocked<IProjectRepository>;

  const mockProject = new Project({
    id: "project-id-1",
    title: "Test Project",
    userId: BigInt(1),
    createdAt: new Date(),
    deletedAt: null,
    feedbackCount: 0,
    feedbacks: [],
  });

  beforeEach(async () => {
    const mockRepository = {
      createProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      getProjects: jest.fn(),
      findById: jest.fn(),
      findProjectWithFeedbacks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: IProjectRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get(IProjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createProject", () => {
    it("should create a new project successfully", async () => {
      // Given
      const createData: CreateProjectDto = {
        title: "New Project",
        userId: BigInt(1),
      };
      repository.createProject.mockResolvedValue(mockProject);

      // When
      const result = await service.createProject(createData);

      // Then
      expect(result).toEqual(mockProject);
      expect(repository.createProject).toHaveBeenCalledWith(createData);
    });
  });

  describe("updateProject", () => {
    const projectId = "project-id-1";
    const updateData: UpdateProjectDto = {
      title: "Updated Title",
      userId: BigInt(1),
    };

    it("should update a project successfully", async () => {
      // Given
      repository.findById.mockResolvedValue({
        ...mockProject,
        userId: updateData.userId,
      });
      repository.updateProject.mockResolvedValue({
        ...mockProject,
        ...updateData,
      });

      // When
      const result = await service.updateProject(projectId, updateData);

      // Then
      expect(repository.findById).toHaveBeenCalledWith(projectId);
      expect(repository.updateProject).toHaveBeenCalledWith(
        projectId,
        updateData,
      );
      expect(result.title).toEqual(updateData.title);
    });

    it("should throw NotFoundException if project not found", async () => {
      // Given
      repository.findById.mockResolvedValue(null);

      // When & Then
      await expect(
        service.updateProject(projectId, updateData),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if user does not have permission", async () => {
      // Given
      const anotherUsersId = BigInt(2);
      repository.findById.mockResolvedValue({
        ...mockProject,
        userId: anotherUsersId,
      });

      // When & Then
      await expect(
        service.updateProject(projectId, updateData),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("deleteProject", () => {
    const projectId = "project-id-1";
    const userId = BigInt(1);

    it("should delete a project successfully", async () => {
      // Given
      repository.findById.mockResolvedValue(mockProject);
      repository.deleteProject.mockResolvedValue(undefined);

      // When
      await service.deleteProject(projectId, userId);

      // Then
      expect(repository.findById).toHaveBeenCalledWith(projectId);
      expect(repository.deleteProject).toHaveBeenCalledWith(projectId, userId);
    });

    it("should throw NotFoundException if project not found", async () => {
      // Given
      repository.findById.mockResolvedValue(null);

      // When & Then
      await expect(service.deleteProject(projectId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ForbiddenException if user does not have permission", async () => {
      // Given
      const anotherUsersProject = { ...mockProject, userId: BigInt(2) };
      repository.findById.mockResolvedValue(anotherUsersProject);

      // When & Then
      await expect(service.deleteProject(projectId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("getProject", () => {
    const projectId = "project-id-1";
    const userId = BigInt(1);

    it("should return a project with feedbacks", async () => {
      // Given
      repository.findProjectWithFeedbacks.mockResolvedValue(mockProject);

      // When
      const result = await service.getProject(projectId, userId);

      // Then
      expect(result).toEqual(mockProject);
      expect(repository.findProjectWithFeedbacks).toHaveBeenCalledWith(
        projectId,
        userId,
      );
    });

    it("should throw NotFoundException if project not found", async () => {
      // Given
      repository.findProjectWithFeedbacks.mockResolvedValue(null);

      // When & Then
      await expect(service.getProject(projectId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getProjects", () => {
    it("should return a list of projects for a user", async () => {
      // Given
      const userId = BigInt(1);
      const projects = [mockProject];
      repository.getProjects.mockResolvedValue(projects);

      // When
      const result = await service.getProjects(userId);

      // Then
      expect(result).toEqual(projects);
      expect(repository.getProjects).toHaveBeenCalledWith(userId);
    });
  });
});
