import { get } from "@/api/server";
import { Project } from "@/types/project";

/**
 * [서버 컴포넌트용]
 * 프로젝트 목록을 조회합니다.
 * @returns 프로젝트 목록
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await get("/project");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch projects on server:", error);
    return [];
  }
};
