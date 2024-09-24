import axios from "axios";

export const FRONTEND_URL = "https://blogflow.heysohail.me";
// export const BACKEND_URL = "https://backend.sohailatwork10.workers.dev";
export const BACKEND_URL = "http://127.0.0.1:8787";

export const api = axios.create({
  baseURL: BACKEND_URL,
});
