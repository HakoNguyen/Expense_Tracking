// src/components/BudgetChecker.jsx
import { useEffect } from 'react';
import { notification } from 'antd';
import { checkBudgetExceeded } from '../../services/budgetApi'; // Import API kiểm tra ngân sách
import PropTypes from "prop-types";

const BudgetChecker = ({ month, year, onNotify }) => {
  useEffect(() => {
    const checkBudget = async () => {
      try {
        const response = await checkBudgetExceeded(month, year); // Gọi API để kiểm tra ngân sách
        const message = response.data; // Lấy thông báo từ API

        // Hiển thị thông báo
        notification.info({
          message: 'Thông báo',
          description: message,
        });

        // Gọi callback để lưu thông báo vào lịch sử
        onNotify(message);
      } catch (error) {
        console.error("Error checking budget:", error);
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi xảy ra khi kiểm tra ngân sách!',
        });
      }
    };

    checkBudget();
  }, [month, year, onNotify]); // Gọi lại khi month hoặc year thay đổi

  return null; // Không cần render gì
};

BudgetChecker.propTypes = {
    month: PropTypes.number.isRequired, 
    year: PropTypes.number.isRequired, 
    onNotify: PropTypes.func.isRequired, 
  }

export default BudgetChecker;