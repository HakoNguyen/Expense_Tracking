// src/components/budget/BudgetContent.jsx
import { useEffect, useState } from 'react';
import BudgetModal from './BudgetModal'; // Import BudgetModal
import { getBudgetList, createBudget, updateBudget, deleteBudget } from '../../services/budgetApi'; // Import API

const BudgetContent = () => {
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await getBudgetList(); // Gọi API để lấy danh sách ngân sách
            setBudgets(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    const handleAddOrUpdateBudget = async (budget) => {
        try {
            if (selectedBudget) {
                await updateBudget(selectedBudget.id, budget); // Cập nhật ngân sách
            } else {
                await createBudget(budget); // Thêm ngân sách mới
            }
            setShowModal(false);
            fetchBudgets(); // Cập nhật danh sách ngân sách
        } catch (error) {
            console.error("Error saving budget:", error);
        }
    };

    const handleEditBudget = (budget) => {
        setSelectedBudget(budget);
        setShowModal(true);
    };

    const handleDeleteBudget = async (id) => {
        try {
            await deleteBudget(id); // Xóa ngân sách
            fetchBudgets(); // Cập nhật danh sách ngân sách
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    return (
        <div className="p-4 border-4 uppercase ">
            <h1 className="text-2xl font-bold mb-4 drop-shadow-lg  text-blue-600">Budget Management</h1>
            <button onClick={() => { setSelectedBudget(null); setShowModal(true); }} className="bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded mb-4">
                Add Budget
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Month</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((budget) => (
                            <tr key={budget.id}>
                                <td className="border border-gray-300 px-4 py-2">{`${budget.month}/${budget.year}`}</td>
                                <td className="border border-gray-300 px-4 py-2">{budget.amount}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button onClick={() => handleEditBudget(budget)} className="text-blue-500 ">Edit</button>
                                    <button onClick={() => handleDeleteBudget(budget.id)} className="text-red-500 ml-2">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <BudgetModal 
                    budget={selectedBudget} 
                    onClose={() => { setShowModal(false); setSelectedBudget(null); }} 
                    onSave={handleAddOrUpdateBudget} 
                />
            )}
        </div>
    );
};

export default BudgetContent;