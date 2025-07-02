import { get } from "@/api";

const getUser = async () => {
  try {
    const res = await get("/user");
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export { getUser };
