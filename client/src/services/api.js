import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
});

export const setAuthHeader = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const loginUser = (payload) => api.post("/api/auth/login", payload);

export const fetchDashboardAnalytics = () => api.get("/api/analytics/dashboard");

export const fetchProjects = (params) => api.get("/api/projects", { params });
export const createProject = (payload) => api.post("/api/projects", payload);
export const updateProject = (id, payload) => api.put(`/api/projects/${id}`, payload);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);

export const fetchDeployments = (params) => api.get("/api/deployments", { params });
export const fetchDeploymentById = (id) => api.get(`/api/deployments/${id}`);
export const createDeployment = (payload) => api.post("/api/deployments", payload);
export const updateDeployment = (id, payload) => api.put(`/api/deployments/${id}`, payload);
export const deleteDeployment = (id) => api.delete(`/api/deployments/${id}`);

export default api;
