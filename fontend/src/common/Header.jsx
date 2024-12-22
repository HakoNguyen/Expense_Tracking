import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <header className="bg-gray-800 text-white w-full py-4 px-6 shadow-md ">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Expense Tracker</h1>
                <nav>
                    <ul className="flex space-x-4 font-semibold">
                        <li>
                            <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/budget" className="hover:text-gray-400">Budget</Link>
                        </li>
                        <li>
                            <Link to="/income" className="hover:text-gray-400">Income</Link>
                        </li>
                        <li>
                            <Link to="/expense" className="hover:text-gray-400">Expense</Link>
                        </li>
                        <li>
                            <Link to="/profile" className="hover:text-gray-400">Profile</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

