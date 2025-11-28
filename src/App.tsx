// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import { adminRoutes } from "./routes/adminRoutes";

import Login from "./pages/Auth/Login/Login";
import AdminLayout from "./components/admin/AdminLayout";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  layout: React.ComponentType<{ children: React.ReactNode }>;
  protected?: boolean;
  requireAuth?: boolean;
}

const publicRoutes: RouteConfig[] = [
  {
    path: "/admin/login",
    element: <Login />,
    layout: PublicLayout,
    protected: false,
    requireAuth: false,
  },
];

const dashboardRoutes: RouteConfig[] = [
  {
    path: "/admin",
    element: <div>Dashboard Content</div>,
    layout: AdminLayout,
    protected: true,
    requireAuth: true,
  },
];

function renderRoute({
  path,
  element,
  layout: Layout,
  protected: isProtected,
  requireAuth,
}: RouteConfig) {
  const content = <Layout>{element}</Layout>;

  if (isProtected) {
    return (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute requireAuth={requireAuth}>{content}</ProtectedRoute>
        }
      />
    );
  }

  return <Route key={path} path={path} element={content} />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="relative">
            <Routes>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              
              {/* Public Routes */}
              {publicRoutes.map(renderRoute)}

              {/* Dashboard Routes */}
              {dashboardRoutes.map(renderRoute)}

              {/* Admin routes - Already protected by AdminGuard */}
              {adminRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}>
                  {route.children?.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      index={child.index}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                          404
                        </h1>
                        <p className="text-gray-400 text-lg">Page not found</p>
                      </div>
                    </div>
                  </PublicLayout>
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;