import { get } from "@/api";

export const logout = async () => {
  try {
    const response = await get("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const withdraw = async () => {
  try {
    const response = await get("/auth/withdraw");
    return response.data;
  } catch (error) {
    console.error("Withdraw failed:", error);
    throw error;
  }
};
