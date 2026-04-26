/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { DataExplorer, Reports, Alerts, Settings } from './components/Views';

export default function App() {
  // Authentication is temporarily bypassed per user request
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout onLogout={() => setIsAuthenticated(false)} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'Dashboard' && <Dashboard />}
      {activeTab === 'Data Explorer' && <DataExplorer />}
      {activeTab === 'Reports' && <Reports />}
      {activeTab === 'Alerts' && <Alerts />}
      {activeTab === 'Settings' && <Settings />}
    </Layout>
  );
}


