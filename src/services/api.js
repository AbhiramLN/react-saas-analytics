class ApiService {
  constructor() {
    this.baseURL = 'https://jsonplaceholder.typicode.com';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  setCachedData(endpoint, data) {
    this.cache.set(endpoint, {
      data,
      timestamp: Date.now()
    });
  }

  getCachedData(endpoint) {
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  async getData(endpoint) {
    const cachedData = this.getCachedData(endpoint);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      this.setCachedData(endpoint, data);
      return data;
    } catch (error) {
      throw new Error('API request failed');
    }
  }

  async refreshDataInBackground() {
    try {
      const data = await this.fetchMockDashboardData();
      this.setCachedData('/dashboard', data);
      return data;
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }

  async fetchMockDashboardData() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      metrics: [
        { title: 'Total Revenue', value: '₹45,678', change: '+8.2%', positive: true },
        { title: 'Total Users', value: '1,234', change: '+12.5%', positive: true },
        { title: 'Active Subscriptions', value: '892', change: '-2.1%', positive: false },
        { title: 'Growth Rate', value: '3.45%', change: '+0.8%', positive: true }
      ],
      revenueData: [
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 },
        { month: 'May', revenue: 6000 },
        { month: 'Jun', revenue: 5500 }
      ],
      userData: [
        { month: 'Jan', users: 240 },
        { month: 'Feb', users: 280 },
        { month: 'Mar', users: 320 },
        { month: 'Apr', users: 380 },
        { month: 'May', users: 420 },
        { month: 'Jun', users: 480 }
      ],
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'Active' }
      ],
      transactions: [
        { id: 1, date: '2024-01-15', amount: 150, status: 'Completed' },
        { id: 2, date: '2024-01-16', amount: 75, status: 'Pending' },
        { id: 3, date: '2024-01-17', amount: 200, status: 'Completed' }
      ],
      recentActivity: [
        { time: '2 hours ago', text: 'New user registration spike detected' },
        { time: '5 hours ago', text: 'Payment processing completed' },
        { time: '1 day ago', text: 'Monthly report generated' }
      ]
    };
  }
}

export default new ApiService();
