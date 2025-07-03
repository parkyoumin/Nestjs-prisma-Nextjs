import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UnifiedResponse } from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const axiosPublicInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      try {
        await post("/auth/refresh");
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error(
          "Token refresh failed, redirecting to login.",
          refreshError,
        );
        window.location.href = "/have-to-login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

async function handleRequest<T>(
  request: Promise<AxiosResponse<UnifiedResponse<T>>>,
): Promise<UnifiedResponse<T>> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
}

const get = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<UnifiedResponse<T>> => {
  return handleRequest(axiosInstance.get(url, config));
};

const post = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<UnifiedResponse<T>> => {
  return handleRequest(axiosInstance.post(url, data, config));
};

const publicPost = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<UnifiedResponse<T>> => {
  return handleRequest(axiosPublicInstance.post(url, data, config));
};

const put = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<UnifiedResponse<T>> => {
  return handleRequest(axiosInstance.put(url, data, config));
};

const del = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<UnifiedResponse<T>> => {
  return handleRequest(axiosInstance.delete(url, config));
};

export { get, post, publicPost, put, del };
