import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable from '../components/DataTable';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState(() => 
    localStorage.getItem('activeTab') || 'overview'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const userRole = localStorage.getItem('userRole') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';

  const metrics = useMemo(() => {
    if (!dashboardData) return [];
    
    if (userRole === 'Admin') {
      return dashboardData.metrics || [];
    } else {
      return (dashboardData.metrics || []).slice(0, 2).map((metric, index) => ({
        ...metric,
        title: metric.title.replace('Total', 'Your'),
        value: index === 0 ? '₹1,234' : metric.value
      }));
    }
  }, [dashboardData, userRole]);

  const recentActivity = useMemo(() => 
    dashboardData?.recentActivity || [], [dashboardData]
  );

  const quickActions = useMemo(() => {
    return userRole === 'Admin' 
      ? ['Generate Report', 'View Analytics', 'Manage Users', 'Settings', 'Admin Panel']
      : ['View Analytics', 'My Reports', 'Profile Settings'];
  }, [userRole]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('activeTab');
    navigate('/login');
  }, [navigate]);

  const handleAction = useCallback((action) => {
    alert(`${action} clicked - would navigate to ${action.toLowerCase().replace(' ', '-')} page`);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return (
        <div className="error-container">
          <h2>Error loading dashboard data</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      );
    }

    return (
      <>
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="dashboard-main-container">
          <div className="dashboard-header">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="header-content">
              <h1>SaaS Analytics Dashboard</h1>
              <div className="header-actions">
                <span className="last-update">
                  Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-tabs">
            {['overview', 'analytics', 'users', 'transactions', 'settings'].map(tab => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="dashboard-main">
            {activeTab === 'overview' && (
              <div className="dashboard-grid">
                {metrics.map((metric, index) => (
                  <div key={index} className="dashboard-card">
                    <h3>{metric.title}</h3>
                    <div className="metric-value">{metric.value}</div>
                    <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                      {metric.change}
                    </div>
                  </div>
                ))}
                
                <div className="dashboard-sections">
                  <div className="dashboard-section">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="activity-item">
                          <span className="activity-time">{activity.time}</span>
                          <span className="activity-text">{activity.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="action-button"
                          onClick={() => handleAction(action)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="dashboard-main">
                <h2>Analytics Overview</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData?.revenueData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="dashboard-main">
                <h2>Team Members</h2>
                <DataTable 
                  data={dashboardData?.users || []}
                  columns={['name', 'email', 'role', 'status']}
                  searchable={true}
                  filterable={true}
                />
              </div>
            )}

            {activeTab === 'transactions' && userRole === 'Admin' && (
              <div className="dashboard-main">
                <h2>Transactions</h2>
                <DataTable 
                  data={dashboardData?.transactions || []}
                  columns={['id', 'date', 'amount', 'status']}
                  searchable={true}
                  filterable={true}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="dashboard-main">
                <h2>Settings</h2>
                <div className="settings-container">
                  <div className="setting-item">
                    <label>Theme</label>
                    <select value={isDarkMode ? 'dark' : 'light'} onChange={(e) => setIsDarkMode(e.target.value === 'dark')}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Language</label>
                    <select defaultValue="en">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      {renderContent()}
    </div>
  );
}

export default DashboardPage;
