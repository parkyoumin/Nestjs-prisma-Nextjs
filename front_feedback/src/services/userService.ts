import { get } from "@/api";

const getUser = async () => {
  try {
    const res = await get("/user");
    return res;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const res = await get("/auth/logout");
    return res;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export { getUser, logout };
