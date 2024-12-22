import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getExpenseList,
  updateExpense,
} from "../../services/expenseApi"; // Import API
import { notification } from 'antd';
import ExpenseModal from "./ExpenseModal"; // Import ExpenseModal


const ExpenseContent = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenseList(); // Gọi API để lấy danh sách chi tiêu
      console.log(response.data); // In ra dữ liệu để kiểm tra
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddOrUpdateExpense = async (expense) => {
    try {
      
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, expense); // Cập nhật chi tiêu
        notification.success({
          message: "Update successfully 😉",
          description: "Expense be updated.",
        })
      } else {
        await createExpense(expense); // Thêm chi tiêu mới
        notification.success({
          message: "Add successfully ❤️",
          description: "Expense be added."
        })
      }
      setShowModal(false);
      fetchExpenses(); // Cập nhật danh sách chi tiêu
    } catch (error) {
      console.error("Error saving expense:", error);
      notification.error({
        message: "Error 🤕",
        description: "Something went wrong!"
      })
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    notification.success({
      message: "Edit successfully 😘",
      description: "Expense be edited."
    })
    setShowModal(true);
   
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id); // Xóa chi tiêu
      fetchExpenses(); // Cập nhật danh sách chi tiêu
      notification.success({
        message: "Delete successfully 🤩",
        description: "Expense be deleted."
      })
    } catch (error) {
      console.error("Error deleting expense:", error);
      notification.error({
        message: "Error 🤕",
        description: "Something went wrong!"
      })
    }
  };

  return (
    <div className="p-4 border-4 uppercase">
      <h1 className="text-2xl font-bold mb-4  text-blue-600">Expense Management</h1>
      <button
        onClick={() => {
          setSelectedExpense(null);
          setShowModal(true);
        }}
        className="bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-sky-500 font-semibold text-white px-4 py-2 rounded mb-4"
      >
        Add Expense
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Notes</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border border-gray-300 px-4 py-2">{expense.name}</td>
                <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{expense.category ? expense.category.name : 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{expense.notes || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleEditExpense(expense)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => {
            setShowModal(false);
            setSelectedExpense(null);
          }}
          onSave={handleAddOrUpdateExpense}
        />
      )}
    </div>
  );
};

export default ExpenseContent;