import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Fonction pour rafraîchir le token JWT si expiré
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return null;

    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Échec du rafraîchissement du token", error);
    return null;
  }
};

// Configuration d'Axios pour inclure automatiquement le token JWT
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    // Vérifier si le token est expiré et le rafraîchir
    if (!token) {
      token = await refreshToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
