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
export const getReferensi = (data: object) => {
    const params = new URLSearchParams(data as Record<string, string>).toString();
    return apiClient({
        method: 'get',
        url: `cariakun?${params}`,
    });
};
export const getTempHasil = () => apiClient.get("hasil");
export const getLogHasil = (data: object) => {
    const params = new URLSearchParams(data as Record<string, string>).toString();
    return apiClient({
        method: 'get',
        url: `loghasil?${params}`,
    });
};

// untuk add / post
export const postHasil = (data: object) => {
    return apiClient({
        method: 'post',
        url: 'add/hasil',
        data: data,
    });
};
interface LogHasil {
    tanggal_stbp: string;
    kode_skpd: string;
    unit_skpd: string;
    keterangan: string;
    kode_rekening: string;
    nama_rekening: string;
    nilai: number;
    created_at: string;
}  
export const postLogHasil = (data: LogHasil[]) => {
    return apiClient({
        method: 'post',
        url: 'add/loghasil',
        data: data,
    });
};

// untuk update / put
export const DelTempHasil = (param: string) => apiClient.delete(`del/hasil/${param}`);
export const DelAllTempHasil = () => apiClient.delete(`del/allhasil`);

// untuk delete
// export const getExampleData = () => apiClient.get("/example-endpoint");