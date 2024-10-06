import axios from "axios";
const BASE_URL =  String(import.meta.env.VITE_BACKEND_URL)


export default axios.create({
  baseURL: BASE_URL
});

// axios private is for interceptors to get refresh
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

