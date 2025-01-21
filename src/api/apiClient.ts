import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT, // Ambil dari variabel env
  timeout: 10000, // Timeout untuk permintaan (opsional)
});

// Tambahkan interceptor (opsional) untuk menangani respons atau error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;