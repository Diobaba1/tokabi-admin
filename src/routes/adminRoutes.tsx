// ============================================================================
// src/routes/adminRoutes.tsx
// ============================================================================

import { RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminGuard from '../components/guards/AdminGuard';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Trades from '../pages/admin/Trades';
import Subscriptions from '../pages/admin/Subscriptions';
import Signals from '../pages/admin/SignalsOld';
import Analytics from '../pages/admin/Analytics';
import { APIKeys } from '../pages/admin/APIKeys';
import Portfolios  from '../pages/admin/Portfolios';
import Affiliates from '../pages/admin/Affiliates';
import Referrals from '../pages/admin/Referrals';
import HealthPage from '../pages/admin/HealthPage';
import LLMProvidersPage from '../pages/admin/LLMProvidersPage';
import CustomAnalysisPage from '../pages/analysis/CustomAnalysisPage';
import QuickAnalysisPage from '../pages/analysis/QuickAnalysisPage';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Trading Bot Signal & Analysis Management Pages

import{SignalManagementPage }  from '../pages/admin/signalsManagement';
import {
  AnalysisControlPage,
  AutoAnalysisConfigPage,
  AnalysisRequestsPage,
} from '../pages/admin/analysisManagement';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'trades',
        element: <Trades />,
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />,
      },
      {
        path: 'signals',
        element: <Signals />,
      },
      {
        path: 'referrals',
        element: <Referrals />,
      },
      {
        path: 'affiliates',
        element: <Affiliates />,
      },
      {
        path: 'portfolios',
        element: <Portfolios />,
      },
      {
        path: 'api-keys',
        element: <APIKeys />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'system',
        element: <HealthPage />,
      },
      {
        path: 'llm-providers',
        element: <LLMProvidersPage />,
      },
      {
        path: 'analysis/custom',
        element: <CustomAnalysisPage />,
      },
      {
        path: 'analysis/quick',
        element: <QuickAnalysisPage />,
      },

      // =====================================================================
      // Trading Bot Signal & Analysis Management Routes
      // =====================================================================
      
      // Main trading bot control center (overview with tabs)
      {
        path: 'trading-bot',
        element: <AdminDashboard />,
      },
      
      // Dedicated signal management page
      {
        path: 'trading-bot/signals',
        element: <SignalManagementPage />,
      },
      
      // Analysis control & trigger page
      {
        path: 'trading-bot/analysis',
        element: <AnalysisControlPage />,
      },
      
      // Auto-analysis configuration
      {
        path: 'trading-bot/analysis/auto-config',
        element: <AutoAnalysisConfigPage />,
      },
      
      // Analysis requests history
      {
        path: 'trading-bot/analysis/requests',
        element: <AnalysisRequestsPage />,
      },
      
    ],
  },
];
