import { post } from "@/api";
import { UnifiedResponse } from "@/types/api";

export const logout = async (): Promise<UnifiedResponse<null>> => {
  try {
    const response = await post<null>("/auth/logout");
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<UnifiedResponse<null>> => {
  try {
    return await post<null>("/auth/refresh");
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};

export const withdraw = async (): Promise<UnifiedResponse<null>> => {
  try {
    const response = await post<null>("/auth/withdraw");
    return response;
  } catch (error) {
    console.error("Withdraw failed:", error);
    throw error;
  }
};
