import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getBarChartData } from "../../services/chartApi"; // Đảm bảo đường dẫn đúng đến file chartApi

import PropTypes from "prop-types";

Chart.register(...registerables);

const BarChart = ({ year }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBarChartData(year); // Gọi hàm từ chartApi
        const data = response.data; // Dữ liệu trả về từ API

        console.log("Dữ liệu từ API:", response); // In ra dữ liệu để kiểm tra

        // Kiểm tra xem data có phải là mảng không
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu không phải là mảng");
        }

        // Sử dụng map để lấy thông tin tháng, ngân sách và chi tiêu
        const months = data.map((item) => item.month);
        const budgets = data.map((item) => item.budget);
        const expenses = data.map((item) => item.totalExpenses);

        // Thiết lập dữ liệu cho biểu đồ
        setChartData({
          labels: months,
          datasets: [
            {
              label: "Budgets",
              data: budgets,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Expenses",
              data: expenses,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
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
      <h2>Bar chart of Budgets and Expenses in {year}</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

BarChart.propTypes = {
  year: PropTypes.number.isRequired,
};
export default BarChart;
