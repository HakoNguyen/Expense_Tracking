import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getPieChartData } from "../../services/chartApi"; // Đảm bảo đường dẫn đúng đến file chartApi
import PropTypes from "prop-types";

Chart.register(...registerables);

const DoughnutChart = ({ month, year }) => {
const [chartData, setChartData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPieChartData(month, year); // Gọi hàm từ chartApi
        const data = response.data; // Dữ liệu trả về từ API
  
        console.log("Dữ liệu từ API cho biểu đồ tròn:", data); // In ra dữ liệu để kiểm tra
  
        // Kiểm tra xem data có phải là mảng không
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu không phải là mảng");
        }
  
        // Tạo mảng cho danh mục và tổng chi tiêu
        const categories = [];
        const expenses = [];
  
        data.forEach(item => {
          const categoryExpense = item.categoryExpensePercentage;
          for (const [category, percentage] of Object.entries(categoryExpense)) {
            // Kiểm tra xem danh mục đã tồn tại trong mảng categories chưa
            const index = categories.indexOf(category);
            if (index === -1) {
              // Nếu chưa tồn tại, thêm mới
              categories.push(category);
              expenses.push((item.totalExpense * percentage) / 100); // Tính toán chi tiêu cho từng danh mục
            } else {
              // Nếu đã tồn tại, cộng dồn chi tiêu
              expenses[index] += (item.totalExpense * percentage) / 100;
            }
          }
        });
  
        // Thiết lập dữ liệu cho biểu đồ
        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Chi tiêu theo danh mục",
              data: expenses,
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
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
  }, [month, year]); // Gọi lại khi month hoặc year thay đổi // Gọi lại khi month hoặc year thay đổi

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Doughnut chart of Expense and Category</h2>
      {chartData && <Doughnut data={chartData} />}
    </div>
  );
};

DoughnutChart.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

export default DoughnutChart;