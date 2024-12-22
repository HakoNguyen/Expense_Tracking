// src/components/IncomeSummary.jsx
import { useEffect, useState } from 'react';
import { getTotalIncomeForMonth } from '../../services/incomeApi'; // Import API để lấy tổng thu nhập

const IncomeSummary = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại
    const [year, setYear] = useState(new Date().getFullYear()); // Năm hiện tại
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTotalIncome();
    }, [month, year]); // Gọi lại khi month hoặc year thay đổi

    const fetchTotalIncome = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTotalIncomeForMonth(month, year); // Gọi API để lấy tổng thu nhập
            setTotalIncome(response.data); // Cập nhật tổng thu nhập
        } catch (error) {
            console.error("Error fetching total income:", error); // In lỗi ra console
            setError("Error fetching total income: " + error.message); // Cập nhật state error
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
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Income Summary</h2>
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
                            <th className="border border-gray-300 px-4 py-2">Total Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">
                                {totalIncome.toLocaleString()} VND
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IncomeSummary;