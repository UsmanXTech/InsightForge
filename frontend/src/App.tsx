/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { DataExplorer, Reports, Alerts, Settings } from './components/Views';
import { onUnauthorized } from './lib/api';

export default function App() {
  const shouldBypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const [isAuthenticated, setIsAuthenticated] = useState(
    shouldBypassAuth || Boolean(localStorage.getItem('insightforge_token'))
  );
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleLogin = (token: string) => {
    localStorage.setItem('insightforge_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('insightforge_token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    return onUnauthorized(() => {
      setIsAuthenticated(false);
    });
  }, []);

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'Dashboard' && <Dashboard />}
      {activeTab === 'Data Explorer' && <DataExplorer />}
      {activeTab === 'Reports' && <Reports />}
      {activeTab === 'Alerts' && <Alerts />}
      {activeTab === 'Settings' && <Settings />}
    </Layout>
  );
}


