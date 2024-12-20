import IncomeContent from '../../components/income/IncomeContent';
import IncomeSummary from '../../components/income/IncomeSumary';

const Budget = () => {
    return (
        <div className="p-4">
            <IncomeSummary/>
            <IncomeContent/> 
        </div>
    );
};

export default Budget;