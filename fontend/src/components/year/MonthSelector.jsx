import PropTypes from "prop-types";

const MonthSelector = ({ onMonthChange, selectedMonth }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1); // Tạo mảng tháng từ 1 đến 12

  return (
    <select className="border-soil border-2 border-sky-500 text 
rounded-md" onChange={(e) => onMonthChange(e.target.value)} value={selectedMonth}>
      {months.map((month) => (
        <option key={month} value={month}>
           {month}
        </option>
      ))}
    </select>
  );
};

MonthSelector.propTypes = {
  onMonthChange: PropTypes.func.isRequired,
  selectedMonth: PropTypes.number.isRequired,
};

export default MonthSelector;