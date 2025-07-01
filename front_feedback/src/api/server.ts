import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const serverApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

serverApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    if (allCookies.length > 0) {
      const cookieString = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
      config.headers.set("Cookie", cookieString);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

serverApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await serverApi.get("/auth/refresh");

        if (refreshResponse.status === 200) {
          return serverApi(originalRequest);
        } else {
          window.location.href = "/have-to-login";
        }
      } catch (refreshError) {
        console.error("Token refresh failed on server:", refreshError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

const get = async (
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return serverApi.get(url, config);
};

const post = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return serverApi.post(url, data, config);
};

const put = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return serverApi.put(url, data, config);
};

const del = async (
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return serverApi.delete(url, config);
};

export { get, post, put, del };
