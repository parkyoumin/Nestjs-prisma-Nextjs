import { post } from "@/api";
import { Project } from "@/types/project";

/**
 * [클라이언트 컴포넌트용]
 * 새로운 프로젝트를 생성합니다.
 * @param title 프로젝트 제목
 * @returns 생성된 프로젝트 정보
 */
export const createProject = async (title: string): Promise<Project> => {
  if (!title.trim()) {
    throw new Error("Project title cannot be empty.");
  }
  const response = await post("/project", { title });
  return response.data;
};
