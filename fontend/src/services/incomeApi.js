import axios from "axios";

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:8008/test1", // Địa chỉ base của API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Các endpoint cho income
export const getIncomeList = () => api.get("/api/incomes");
export const createIncome = (data) => api.post("/api/incomes", data);
export const updateIncome = (id, data) => api.put(`/api/incomes/${id}`, data);
export const deleteIncome = (id) => api.delete(`/api/incomes/${id}`);
export const getTotalIncomeForMonth = (month, year) =>
  api.get(`/api/incomes/total?month=${month}&year=${year}`);
