import axios from "axios";

// Create a single reusable Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", // Uses your .env variable
    timeout: 120000, // 30s timeout
});

// Optional: you can log requests for debugging
api.interceptors.request.use((config) => {
    console.log("➡️ Sending request to:", config.url);
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ API Error:", error.message);
        return Promise.reject(error);
    }
);

export default api;
