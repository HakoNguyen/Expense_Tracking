import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashbroad from "./pages/HomePage/Dashbroad.jsx";
import Budget from "./pages/Budget/Budget.jsx";
import Income from "./pages/Income/Income.jsx";
import Expense from "./pages/Expense/Expense.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Header from "./common/Header.jsx";
import Footer from "./common/Footer.jsx";

function App() {
    return (
        <Router>
            <div className="app flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 bodyWeb " style={{marginBottom: "450px"}}> {/* Thêm overflow-auto để cuộn nội dung */}
                    <Routes>
                        <Route path="/dashboard" element={<Dashbroad />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expense" element={<Expense />} /> 
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
                <Footer /> {/* Đặt Footer ở dưới cùng */}
            </div>
        </Router>
    );
}

export default App;