import { get } from "@/api";
import { UnifiedResponse } from "@/types/api";
import { User } from "@/types/user";

const getUser = async (): Promise<UnifiedResponse<User>> => {
  try {
    const response = await get<User>("/user");
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export { getUser };
