import apiClient from "./apiClient";

// untuk get
export const getKasus = (data: object) => {
    const params = new URLSearchParams(data as Record<string, string>).toString();
  
    return apiClient({
        method: 'get',
        url: `kasus?${params}`,
    });
};
export const getCategories = () => apiClient.get("lookup/categories");
export const getJenisBarang = () => apiClient.get("lookup/jenisbarang");
export const getStatus = (data: object) => {
    const params = new URLSearchParams(data as Record<string, string>).toString();
  
    return apiClient({
        method: 'get',
        url: `lookup/status?${params}`,
    });
};

// untuk add / post
// export const getExampleData = () => apiClient.get("/example-endpoint");

// untuk update / put
// export const getExampleData = () => apiClient.get("/example-endpoint");

// untuk delete
// export const getExampleData = () => apiClient.get("/example-endpoint");