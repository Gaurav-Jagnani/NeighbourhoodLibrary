import axios from "axios";
const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

type ApiError = {
  status: number;
  data: unknown;
};
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error?.response?.data ?? error.message;
    const status = error?.response?.status ?? error.status;
    return Promise.reject<ApiError>({
      status,
      data,
    });
  }
);

export function getBooks() {
  return api.get("/books");
}

export function getUsers() {
  return api.get("/users");
}
