import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './common/Sidebar.jsx';
import Dashbroad from "./pages/HomePage/Dashbroad.jsx";
import Budget from "./pages/Budget/Budget.jsx";
import Income from "./pages/Income/Income.jsx";
import Expense from "./pages/Expense/Expense.jsx";
import Profile from "./pages/Profile/Profile.jsx";


function App() {
    return (
        <Router>
            <div className="app flex">
                <Sidebar /> {/* Không cần truyền messages nữa */}
                <div className="flex-1">
                    <div className="bodyWeb">
                        <Routes>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/dashboard" element={<Dashbroad />} />
                            <Route path="/budget" element={<Budget />} />
                            <Route path="/income" element={<Income />} />
                            <Route path="/expense" element={<Expense />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;