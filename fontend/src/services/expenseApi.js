import axios from "axios";

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:8008/test1", // Địa chỉ base của API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Các endpoint cho expense
export const getExpenseList = () => api.get("/api/expenses");
export const getTotalExpenseForMonth = (month, year) =>
  api.get(`/api/expenses/total?month=${month}&year=${year}`);
export const createExpense = (data) => api.post("/api/expenses", data);
export const updateExpense = (id, data) => api.put(`/api/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/api/expenses/${id}`);
