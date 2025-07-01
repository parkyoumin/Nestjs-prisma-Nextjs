import { get } from "@/api";

export const logout = async () => {
  try {
    const res = await get("/auth/logout");
    return res;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
