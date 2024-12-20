import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getLineChartData } from "../../services/chartApi"; // Đảm bảo đường dẫn đúng đến file chartApi
import PropTypes from "prop-types";

Chart.register(...registerables);

const LineChart = ({ year }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLineChartData(year); // Gọi hàm từ chartApi
        const data = response.data; // Dữ liệu trả về từ API

        console.log("Dữ liệu từ API cho biểu đồ đường:", data); // In ra dữ liệu để kiểm tra

        // Kiểm tra xem data có phải là mảng không
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu không phải là mảng");
        }

        // Sử dụng map để lấy thông tin tháng, tổng chi tiêu và ngân sách
        const months = data.map((item) => item.month.substring(0, 7)); // Lấy tháng từ chuỗi ngày
        const totalExpenses = data.map((item) => item.totalExpense);
        const budgetLimits = data.map((item) => item.budgetLimit); // Lấy ngân sách

        // Thiết lập dữ liệu cho biểu đồ
        setChartData({
          labels: months,
          datasets: [
            {
              label: "Total Expenses",
              data: totalExpenses,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
            {
              label: "Budget Limit",
              data: budgetLimits,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            }
          ],
        });
      } catch (fetchError) {
        console.error("Lỗi:", fetchError.message);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); // Gọi lại khi year thay đổi

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Line chart of Budgets and Expenses in {year}</h2>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

LineChart.propTypes = {
  year: PropTypes.number.isRequired,
};

export default LineChart;