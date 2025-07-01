import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "./project.service";
import { IProjectRepository } from "../domain/project.repository";
import { Project } from "../domain/project.entity";
import { CreateProjectDto, UpdateProjectDto } from "src/types/project.type";
import { ForbiddenException } from "@nestjs/common";

// IProjectRepository의 가짜(Mock) 객체를 생성합니다.
const mockProjectRepository = {
  createProject: jest.fn(),
  updateProject: jest.fn(),
  findById: jest.fn(),
  deleteProject: jest.fn(),
};

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: jest.Mocked<IProjectRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: IProjectRepository,
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get(IProjectRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createProject", () => {
    it("새로운 프로젝트를 성공적으로 생성해야 한다", async () => {
      // Given
      const createDto: CreateProjectDto = {
        title: "New Test Project",
        userId: BigInt(1),
      };
      const expectedProject = new Project();
      expectedProject.id = "new-uuid";
      expectedProject.title = createDto.title;
      expectedProject.userId = createDto.userId;

      repository.createProject.mockResolvedValue(expectedProject);

      // When
      const result = await service.createProject(createDto);

      // Then
      expect(result).toEqual(expectedProject);
      expect(repository.createProject).toHaveBeenCalledTimes(1);
      expect(repository.createProject).toHaveBeenCalledWith(createDto);
    });
  });

  describe("updateProject", () => {
    const projectId = "some-uuid";
    const updateDto: UpdateProjectDto = {
      title: "Updated Project Title",
      userId: BigInt(1),
    };

    it("프로젝트를 성공적으로 수정해야 한다", async () => {
      // Given
      const expectedProject = new Project();
      expectedProject.id = projectId;
      expectedProject.title = updateDto.title;

      repository.updateProject.mockResolvedValue(expectedProject);

      // When
      const result = await service.updateProject(projectId, updateDto);

      // Then
      expect(result).toEqual(expectedProject);
      expect(repository.updateProject).toHaveBeenCalledTimes(1);
      expect(repository.updateProject).toHaveBeenCalledWith(
        projectId,
        updateDto,
      );
    });

    it("프로젝트가 없거나 권한이 없으면 ForbiddenException을 던져야 한다", async () => {
      // Given
      repository.updateProject.mockResolvedValue(null);

      // When & Then
      await expect(service.updateProject(projectId, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("deleteProject", () => {
    const projectId = "some-uuid";
    const userId = BigInt(1);

    it("프로젝트를 성공적으로 삭제해야 한다", async () => {
      // Given
      repository.deleteProject.mockResolvedValue(true);

      // When
      await service.deleteProject(projectId, userId);

      // Then
      expect(repository.deleteProject).toHaveBeenCalledWith(projectId, userId);
    });

    it("프로젝트가 없거나 권한이 없으면 ForbiddenException을 던져야 한다", async () => {
      // Given
      repository.deleteProject.mockResolvedValue(false);

      // When & Then
      await expect(service.deleteProject(projectId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
