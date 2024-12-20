import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Đảm bảo rằng bạn đã đổi tên tệp ở đây

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);