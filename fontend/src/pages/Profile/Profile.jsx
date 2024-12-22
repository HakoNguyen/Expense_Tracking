import { useEffect, useState } from 'react';
import { getBudgetForCurrentMonth } from '../../services/budgetApi'; // Giả sử bạn đã có API này
import { ToastContainer, toast } from 'react-toastify';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
    const [user, setUser ] = useState({
        avatar: 'https://via.placeholder.com/150', // Đường dẫn avatar mặc định
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
    });
    const [budget, setBudget] = useState(0);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newAvatar, setNewAvatar] = useState(user.avatar);

    useEffect(() => {
        // Lấy tổng ngân sách cho tháng hiện tại
        const fetchBudget = async () => {
            const totalBudget = await getBudgetForCurrentMonth(); // Gọi API để lấy ngân sách
            setBudget(totalBudget);
        };
        fetchBudget();

        // Lấy thông tin người dùng từ Local Storage
        const storedUser  = JSON.parse(localStorage.getItem('user'));
        if (storedUser ) {
            setUser (storedUser );
            setNewName(storedUser .name);
            setNewEmail(storedUser .email);
            setNewAvatar(storedUser .avatar);
        }
    }, []);

    const handleEdit = () => {
        setEditing(!editing);
        if (editing) {
            // Cập nhật thông tin người dùng
            const updatedUser  = { ...user, name: newName, email: newEmail, avatar: newAvatar };
            setUser (updatedUser );
            localStorage.setItem('user', JSON.stringify(updatedUser )); // Lưu thông tin người dùng vào Local Storage
            toast.success('Thông tin đã được cập nhật thành công!'); // Thông báo alert
        
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result); 
            };
            reader.readAsDataURL(file); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-4 bg-white rounded-lg shadow-md">
         <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Profile</h1>
            <div className="flex items-center mb-6">
                <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded mr-4 border border-black " />
                <div>
               <h2 className="text-2xl font-semibold"><UserOutlined /> {user.name}</h2>
                    <p className="text-gray-600"><PhoneOutlined /> {user.phone}</p>
                    <p className="text-gray-600"><MailOutlined /> {user.email}</p>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold"><BankOutlined /> {budget.toLocaleString()} VND</h3>
            </div>
            <div className="flex flex-col">
                {editing ? (
                    <>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 rounded"
                            placeholder="New Name"
                        />
                        <input
                            type="text"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 rounded"
                            placeholder="New Email"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="border border-gray-300 p-2 mb-4 rounded"
                        />
                    </>
                ) : null}
                <button
                    onClick={handleEdit}
                    className={`bg-blue-500 text-white p-2 rounded ${editing ? 'bg-green-500' : ''} font-semibold`}
                >
                    {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>
        </div>
    );
};

export default Profile;