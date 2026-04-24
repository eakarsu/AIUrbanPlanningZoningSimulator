import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCity, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ currentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <div className="navbar-brand-icon">
          <FaCity />
        </div>
        AI Urban Planning
      </div>
      <div className="navbar-center">{currentPage}</div>
      <div className="navbar-right">
        <button className="navbar-logout" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '0.4rem' }} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
