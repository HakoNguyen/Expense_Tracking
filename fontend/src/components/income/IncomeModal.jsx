// src/components/income/IncomeModal.jsx
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createCategory, getCategoryList } from "../../services/categoryApi"; // Import API để lấy danh sách danh mục

const IncomeModal = ({ income, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // ID của danh mục đã chọn
  const [newCategoryName, setNewCategoryName] = useState(""); // Tên danh mục mới

  useEffect(() => {
    // Lấy danh sách danh mục khi modal mở
    const fetchCategories = async () => {
      try {
        const response = await getCategoryList();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    if (income) {
      setName(income.name);
      setAmount(income.amount);
      setDate(new Date(income.date).toISOString().split("T")[0]);
      setNotes(income.notes);
      setSelectedCategoryId(income.categoryId); // Thiết lập danh mục đã chọn
    } else {
      setName("");
      setAmount("");
      setDate("");
      setNotes("");
      setSelectedCategoryId("");
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryId = selectedCategoryId;

    // Nếu không chọn danh mục, tạo danh mục mới
    if (!selectedCategoryId && newCategoryName) {
      try {
        const newCategory = await createCategory({ name: newCategoryName });
        categoryId = newCategory.data.id; // Lấy ID của danh mục mới
      } catch (error) {
        console.error("Error creating category:", error);
        return; // Dừng lại nếu có lỗi
      }
    }

    const incomeData = {
      name,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      notes,
      categoryId: categoryId, // Sử dụng ID của danh mục đã chọn hoặc mới tạo
    };
    onSave(incomeData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {income ? "Edit Income" : "Add Income"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Notes</label>
            <input
              type="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setNewCategoryName(""); // Reset tên danh mục mới khi chọn danh mục
              }}
              className="border border-gray-300 p-2 w-full"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or create a new category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 p-2 w-full mt-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {income ? "Update Income" : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

IncomeModal.propTypes = {
  income: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default IncomeModal;
