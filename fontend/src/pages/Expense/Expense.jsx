import ExpenseContent from "../../components/expense/ExpenseContent"
import ExpenseSummary from "../../components/expense/ExpenseSummary";
import PropTypes from 'prop-types';

const Expense = ({ setMessages  }) => {
    return (
        <div className="p-4">
            <ExpenseSummary setMessages={setMessages} />
            <ExpenseContent />
        </div>
    );
};


Expense.propTypes = {
    setMessages : PropTypes.func.isRequired,
};
export default Expense;