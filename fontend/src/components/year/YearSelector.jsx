import PropTypes from "prop-types";
const YearSelector = ({ onYearChange, selectedYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, index) => currentYear + index); // Tạo mảng năm từ năm hiện tại

  return (
    <select className="border-soil border-2 border-indigo-700
rounded-md"  onChange={(e) => onYearChange(e.target.value)} value={selectedYear}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};
YearSelector.propTypes = {
  onYearChange: PropTypes.number.isRequired,
  selectedYear: PropTypes.number.isRequired,
};

export default YearSelector;