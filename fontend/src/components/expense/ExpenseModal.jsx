import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createCategory, getCategoryList } from "../../services/categoryApi"; // Import API để lấy danh sách danh mục

const ExpenseModal = ({ expense, onClose, onSave }) => {
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

    if (expense) {
      setName(expense.name);
      setAmount(expense.amount);
      setDate(new Date(expense.date).toISOString().split("T")[0]);
      setNotes(expense.notes);
      setSelectedCategoryId(expense.categoryId); // Thiết lập danh mục đã chọn
    } else {
      setName("");
      setAmount("");
      setDate("");
      setNotes("");
      setSelectedCategoryId("");
    }
  }, [expense]);

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

    const expenseData = {
      name,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      notes,
      categoryId: categoryId, // Sử dụng ID của danh mục đã chọn hoặc mới tạo
    };
    onSave(expenseData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {expense ? "Edit Expense" : "Add Expense"}
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
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 p-2 w-full"
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
          </div>
          <div className="mb-4">
            <label className="block mb-1">New Category</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {expense ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ExpenseModal.propTypes = {
  expense: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ExpenseModal;
