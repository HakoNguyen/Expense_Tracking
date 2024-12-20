import { useState } from "react";
import BarChart from "../../components/chart/BarChart.jsx"; // Đảm bảo đường dẫn đúng đến component BarChart
import LineChart from "../../components/chart/LineChart.jsx";
import PieChart from "../../components/chart/PieChart.jsx"; // Import PieChart
import MonthSelector from "../../components/year/MonthSelector.jsx"; // Import MonthSelector
import YearSelector from "../../components/year/YearSelector.jsx"; // Đảm bảo đường dẫn đúng đến YearSelector

function DashBroad() {
  const [selectedBarYear, setSelectedBarYear] = useState(
    new Date().getFullYear()
  );
  const [selectedLineYear, setSelectedLineYear] = useState(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleBarYearChange = (year) => {
    setSelectedBarYear(year);
  };

  const handleLineYearChange = (year) => {
    setSelectedLineYear(year);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="uppercase">
      <h1 className="font-semibold text-6xl font-mono text-blue-600 text-center ">
        Dashboard
      </h1>

      <div
        className="text-base text-black font-semibold "
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "50px",
          marginLeft: "80px",
        }}
      >
        <div style={{ flex: 1, marginRight: "20px" }}>
          <label htmlFor="bar-year-select" style={{padding:'2px'}}>Select Year for Bar Chart:</label>
          <YearSelector
            onYearChange={handleBarYearChange}
            selectedYear={selectedBarYear}
          />
          <div
            style={{ width: "600px", height: "200px", marginBottom: "150px" }}
          >
            <BarChart year={selectedBarYear} />
          </div>

          <label htmlFor="line-year-select" style={{ marginTop: "150px", padding:'2px'}}>
            Select Year for Line Chart:
          </label>
          <YearSelector
            onYearChange={handleLineYearChange}
            selectedYear={selectedLineYear}
          />
          <div style={{ width: "600px", height: "200px" }}>
            <LineChart year={selectedLineYear} />
          </div>
        </div>

        <div style={{ width: "400px", marginLeft: "20px"}}>
          <h2>Expense based on Category</h2>
          <MonthSelector 
            onMonthChange={handleMonthChange}
            selectedMonth={selectedMonth}
          />
          <YearSelector
            onYearChange={setSelectedYear}
            selectedYear={selectedYear}
          />
          <PieChart month={selectedMonth} year={selectedYear} />
        </div>
      </div>
    </div>
  );
}

export default DashBroad;
