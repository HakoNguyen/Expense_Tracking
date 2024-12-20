import { Link } from 'react-router-dom'; // Đảm bảo bạn đã cài đặt react-router-dom
const Sidebar = () => {
    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Expense Tracker</h2>
            <nav>
                <ul style={{marginTop: "30px",}}>
                    <li className="mb-2 text-center font-semibold ">
                        <Link to="/profile" className="hover:text-gray-400">Profile</Link>
                    </li>
                    <li className="mb-2 text-center font-semibold pt-4 ">
                        <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                    </li>
                    <li className="mb-2 text-center pt-4 font-semibold">
                        <Link to="/budget" className="hover:text-gray-400">Budget</Link>
                    </li>
                    <li className="mb-2 text-center pt-4 font-semibold">
                        <Link to="/income" className="hover:text-gray-400">Income</Link>
                    </li>
                    <li className="mb-2 text-center pt-4 font-semibold">
                        <Link to="/expense" className="hover:text-gray-400">Expense</Link>
                    </li>
                </ul>
               
                <div className='text-center' style={{marginBottom: "10px", marginTop: "450px"}}><p>© {new Date().getFullYear()} <br className="" />Expense Tracker. <br className="" />All rights reserved.</p></div>
            </nav>
        </aside>
    );
};


export default Sidebar;