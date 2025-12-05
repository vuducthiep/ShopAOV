import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-8">Admin Panel</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/admin" className="block p-3 hover:bg-gray-700 rounded">
              Thống Kê
            </Link>
          </li>
          <li>
            <Link to="/admin/accounts" className="block p-3 hover:bg-gray-700 rounded">
              Quản Lý Tài Khoản Game
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="block p-3 hover:bg-gray-700 rounded">
              Quản Lý Người Dùng
            </Link>
          </li>
          <li>
            <Link to="/admin/transactions" className="block p-3 hover:bg-gray-700 rounded">
              Quản Lý Giao Dịch
            </Link>
          </li>
          <li>
            <Link to="/admin/accgames" className="block p-3 hover:bg-gray-700 rounded">
              Quản Lý Acc Game
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
