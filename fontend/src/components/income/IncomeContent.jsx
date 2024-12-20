import { useEffect, useState } from "react";
import {
  createIncome,
  deleteIncome,
  getIncomeList,
  updateIncome,
} from "../../services/incomeApi"; // Import API
import { createBudget } from "../../services/budgetApi"; // Import API tạo ngân sách
import { getBudgetByMonthAndYear } from "../../services/budgetApi";
import IncomeModal from "./IncomeModal"; // Import IncomeModal
import { notification } from "antd";


const IncomeContent = () => {
  const [incomes, setIncomes] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await getIncomeList(); // Gọi API để lấy danh sách thu nhập
      console.log(response.data); // In ra dữ liệu để kiểm tra
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const handleAddOrUpdateIncome = async (income) => {
      try {
          if (selectedIncome) {
              await updateIncome(selectedIncome.id, income); // Cập nhật thu nhập
              notification.success({
                message: "Update successfully 😉",
                description: "Income be updated.",
              })

          } else {
              await createIncome(income); // Thêm thu nhập mới
              notification.success({
                message: "Add successfully ❤️",
                description: "Income be added."
              })

              // Lấy tháng và năm từ thu nhập mới
              const incomeDate = new Date(income.date);
              const month = incomeDate.getMonth() + 1; // Tháng (1-12)
              const year = incomeDate.getFullYear(); // Năm

              // Kiểm tra xem ngân sách đã tồn tại cho tháng và năm này chưa
              const existingBudget = await getBudgetByMonthAndYear(month, year); // Gọi API để kiểm tra ngân sách

              // Nếu ngân sách chưa tồn tại, tạo ngân sách mới
              if (!existingBudget.data || existingBudget.data.length === 0) {
                  const budgetData = {
                      name: `Budget for ${incomeDate.toLocaleDateString()}`,
                      amount: income.amount, // Hoặc một giá trị ngân sách mặc định
                      month: month,
                      year: year,
                  };

                  await createBudget(budgetData); // Gọi API để tạo ngân sách
              }
          }
          setShowModal(false);
          fetchIncomes(); // Cập nhật danh sách thu nhập
      } catch (error) {
          console.error("Error saving income:", error);
          notification.error({
            message: "Error 🤕",
            description: "Something went wrong!"
          })
      }
  };
  const handleEditIncome = (income) => {
    setSelectedIncome(income);
    setShowModal(true);
    notification.success({
      message: "Edit successfully 😘",
      description: "Income be edited."
    })
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id); // Xóa thu nhập
      fetchIncomes(); // Cập nhật danh sách thu nhập
      notification.success({
        message: "Delete successfully 🤩",
        description: "Income be deleted."
      })
    } catch (error) {
      console.error("Error deleting income:", error);
      notification.error({
        message: "Error 🤕",
        description: "Something went wrong!"
      })
    }
  };

  return (
    <div className="p-4 border-4 uppercase">
      <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">Income Management</h1>
      <button
        onClick={() => {
          setSelectedIncome(null);
          setShowModal(true);
        }}
        className="bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-sky-500 font-semibold text-white px-4 py-2 rounded mb-4"
      >
        Add Income
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
              <th className=" border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td className="border border-gray-300 px-4 py-2">{income.name}</td>
                <td className="border border-gray-300 px-4 py-2">{income.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{income.category ? income.category.name : 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{income.notes || 'N/A'}</td>                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleEditIncome(income)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDeleteIncome(income.id)} className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <IncomeModal
          income={selectedIncome}
          onClose={() => {
            setShowModal(false);
            setSelectedIncome(null);
          }}
          onSave={handleAddOrUpdateIncome}
        />
      )}
    </div>
  );
};

export default IncomeContent;