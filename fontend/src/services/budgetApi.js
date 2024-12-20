// src/services/budgetApi.js
import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:8008/test1', // Địa chỉ base của API
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// Endpoint cho danh sách ngân sách
export const getBudgetList = () => api.get('/api/budgets'); // Sửa đường dẫn cho đúng
export const getBudgetByMonthAndYear = (month, year) => api.get(`/api/budgets/monthly/${month}/${year}`); // Sửa đường dẫn cho đúng
export const createBudget = (data) => api.post('/api/budgets', data); // Sửa đường dẫn cho đúng
export const updateBudget = (id, data) => api.put(`/api/budgets/${id}`, data); // Sửa đường dẫn cho đúng
export const deleteBudget = (id) => api.delete(`/api/budgets/${id}`); // Sửa đường dẫn cho đúng

export const getBudgetForCurrentMonth = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
    const year = currentDate.getFullYear(); // Năm hiện tại

    try {
        const response = await getBudgetByMonthAndYear(month, year);
        return response.data.amount; // Giả sử API trả về đối tượng có trường amount
    } catch (error) {
        console.error("Error fetching budget:", error);
        return 0; // Trả về 0 nếu có lỗi
    }
};