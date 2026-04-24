import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogOut, LayoutDashboard, FileText, Users, MapPin, LogIn } from 'lucide-react';

const Navbar = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <FileText className="mr-2" />
          LGU Document Repository
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <Link to="/admin/dashboard" className="hover:text-blue-200 flex items-center">
                <LayoutDashboard size={18} className="mr-1" /> Admin Portal
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-blue-200">Documents</Link>
              <Link to="/login" className="hover:text-blue-200 flex items-center">
                <LogIn size={18} className="mr-1" /> Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
