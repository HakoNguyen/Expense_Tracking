// src/components/budget/BudgetModal.jsx
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const BudgetModal = ({ budget, onClose, onSave }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (budget) {
            setMonth(budget.month);
            setYear(budget.year);
            setAmount(budget.amount);
        } else {
            setMonth('');
            setYear('');
            setAmount('');
        }
    }, [budget]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ month, year, amount });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">{budget ? 'Edit Budget' : 'Add Budget'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Month</label>
                        <input 
                            type="text" 
                            value={month} 
                            onChange={(e) => setMonth(e.target.value)} 
                            className="border border-gray-300 p-2 w-full" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Year</label>
                        <input 
                            type="text" 
                            value={year} 
                            onChange={(e) => setYear(e.target.value)} 
                            className="border border-gray-300 p-2 w-full" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Amount</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="border border-gray-300 p-2 w-full" 
                            required 
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{budget ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

BudgetModal.propTypes = {
    budget: PropTypes.shape({
        month: PropTypes.string,
        year: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default BudgetModal;
