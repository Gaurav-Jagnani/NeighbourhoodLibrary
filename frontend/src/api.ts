import axios from "axios";
const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

type ApiError = {
  status: number;
  data: unknown;
};
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic3RyaW5nIn0.2ExL-ktKXaYUic1WfL7hYdzEy_01HLg2eqWuvRLm1Xo";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
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

export function createUser(payload) {
  return api.post("/users/add", payload);
}
export function updateUser(payload) {
  return api.post("/users/update", payload);
}

export function getBorrows() {
  return api.get("/borrow");
}

export function login(payload: { username: string; password: string }) {
  return api.post("/auth/login", payload);
}

export function borrow(payload: { book_id: number; user_id: number }) {
  return api.post("/borrow/borrow", payload);
}

export function returnBook(borrow_id: { borrow_id: number }) {
  console.log(borrow_id);
  return api.post(
    "/borrow/return?" + new URLSearchParams(borrow_id).toString()
  );
}
