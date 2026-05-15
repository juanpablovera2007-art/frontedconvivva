import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-convivva.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
