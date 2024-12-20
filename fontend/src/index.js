
import ReactDOM from 'react-dom/client'; // Import createRoot từ react-dom/client
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);