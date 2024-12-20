import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:8008/test1', // Địa chỉ base của API
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// Các endpoint cho biểu đồ
export const getBarChartData = (year) => api.get(`/api/analysis/bar-chart?year=${year}`);
export const getLineChartData = (year) => api.get(`/api/analysis/line-chart?year=${year}`);
export const getPieChartData = (month, year) => api.get(`/api/analysis/pie-chart?month=${month}&year=${year}`);