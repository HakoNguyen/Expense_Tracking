import { useEffect, useState } from 'react';
import { getTotalExpenseForMonth } from '../../services/expenseApi'; // Import API để lấy tổng chi tiêu
import { getBudgetByMonthAndYear } from '../../services/budgetApi'; // Import API để lấy ngân sách
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseSummary = () => {
    const [totalExpense, setTotalExpense] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại
    const [year, setYear] = useState(new Date().getFullYear()); // Năm hiện tại
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Gọi hàm fetchTotalExpense khi month hoặc year thay đổi
    useEffect(() => {
        fetchTotalExpense();
    }, [month, year]); // Gọi lại khi month hoặc year thay đổi

    const fetchTotalExpense = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTotalExpenseForMonth(month, year); // Gọi API để lấy tổng chi tiêu
            const totalExpense = response.data; // Lưu tổng chi tiêu từ phản hồi

            setTotalExpense(totalExpense); // Cập nhật tổng chi tiêu

            // Kiểm tra ngân sách
            const budgetResponse = await getBudgetByMonthAndYear(month, year);
            const budgetAmount = budgetResponse.data.amount;

            // So sánh tổng chi tiêu với ngân sách
            if (totalExpense > budgetAmount) {
                toast.error(`Cảnh báo: Tổng chi tiêu ${totalExpense.toLocaleString()} VND vượt quá ngân sách ${budgetAmount.toLocaleString()} VND cho tháng ${month}/${year}.`);
            } else {
                toast.success(`Thông báo: Tổng chi tiêu ${totalExpense.toLocaleString()} VND chưa vượt quá ngân sách ${budgetAmount.toLocaleString()} VND cho tháng ${month}/${year}.`);
            }

        } catch (error) {
            console.error("Error fetching total expense:", error); // In lỗi ra console
            setError("Error fetching total expense: " + error.message); // Cập nhật state error
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        setMonth(Number(e.target.value)); // Cập nhật tháng
    };

    const handleYearChange = (e) => {
        setYear(Number(e.target.value)); // Cập nhật năm
    };

    return (
        <div className="p-4 border-4 uppercase">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Expense Summary</h2>
            <div className="mb-4">
                <label className="mr-2">Month:</label>
                <select value={month} onChange={handleMonthChange}>
                    {Array.from({ length: 12 }, (_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
                <label className="ml-4 mr-2">Year:</label>
                <input
                    type="number"
                    value={year}
                    onChange={handleYearChange}
                    className="border border-gray-300 rounded px-2"
                />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Total Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">
                                {totalExpense.toLocaleString()} VND
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExpenseSummary