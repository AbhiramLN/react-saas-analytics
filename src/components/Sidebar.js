import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const userRole = localStorage.getItem('userRole') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      path: '/dashboard',
      tab: 'overview'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📈',
      path: '/dashboard',
      tab: 'analytics'
    },
    { 
      id: 'users', 
      label: userRole === 'Admin' ? 'Users' : 'Team', 
      icon: '👥',
      path: '/dashboard',
      tab: 'users'
    },
    ...(userRole === 'Admin' ? [{
      id: 'transactions', 
      label: 'Transactions', 
      icon: '💳',
      path: '/dashboard',
      tab: 'transactions'
    }] : []),
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️',
      path: '/dashboard',
      tab: 'settings'
    }
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
    localStorage.setItem('activeTab', item.tab);
    
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('activeTab');
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onToggle} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h2>📊 SaaS Analytics</h2>
          </div>
          <button className="sidebar-close" onClick={onToggle}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-toggle">
            <button className="theme-button" onClick={toggleTheme}>
              <span className="theme-icon">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
              <span className="theme-label">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
          
          <div className="user-info">
            <div className="user-details">
              <span className="user-email">
                {userEmail}
              </span>
              <span className={`user-role ${userRole.toLowerCase()}`}>
                {userRole}
              </span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
