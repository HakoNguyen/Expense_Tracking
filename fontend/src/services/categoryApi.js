// src/services/categoryApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8008/test1/api/categories';

export const getCategoryList = async () => {
    return await axios.get(API_URL);
};

export const createCategory = async (categoryData) => {
    return await axios.post(API_URL, categoryData);
};

export const updateCategory = async (id, categoryData) => {
    return await axios.put(`${API_URL}/${id}`, categoryData);
};

export const deleteCategory = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};