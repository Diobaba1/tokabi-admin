// =============================================================================
// FILE: src/pages/AdminDashboard.tsx
// =============================================================================
// Admin Dashboard Page - Full admin control center
// =============================================================================

import React, { useState, useCallback } from "react";
import {
  useAdminSignals,
  useAdminDashboard,
  useAnalysisTrigger,
  useSignalDetail,
  useAvailableSymbols,
} from "../../components/hooks";
import {
  Signal,
  SignalDetail as SignalDetailType,
  SignalCreateRequest,
  SignalUpdateRequest,
  SignalStatus,
} from "../../types";
import { AdminAnalysisDashboard } from "../../components/admin/AdminAnalysisDashboard";
import { AdminSignalsManagement } from "../../components/admin";
import { SignalDetailModal } from "../../components/signals/SignalDetailModal";
import { SignalForm } from "../../components/signals/SignalForm";
import { Card, Button, Badge } from "../../components/ui";

type AdminTab = "overview" | "signals" | "analysis";

const AdminDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingSignal, setEditingSignal] = useState<SignalDetailType | null>(null);

  // Hooks
  const {
    signals,
    isLoading: isLoadingSignals,
    error: signalsError,
    filters,
    fetchSignals,
    createSignal,
    updateSignal,
    deleteSignal,
    bulkDelete,
    cleanupExpired,
    updateFilters,
  } = useAdminSignals();

  const {
    settings,
    autoAnalysisConfig,
    providers,
    activeProviders,
    recentRequests,
    isLoading: isLoadingDashboard,
    actions,
  } = useAdminDashboard();

  const { triggerAsync } = useAnalysisTrigger();
  const { signal: selectedSignal, isLoading: isLoadingDetail } =
    useSignalDetail(selectedSignalId);
  const { symbols } = useAvailableSymbols();

  // Handlers
  const handleViewSignal = useCallback((signal: Signal) => {
    setSelectedSignalId(signal.id);
    setShowDetailModal(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedSignalId(null);
  }, []);

  const handleCreateSignal = useCallback(() => {
    setFormMode("create");
    setEditingSignal(null);
    setShowFormModal(true);
  }, []);

  const handleEditSignal = useCallback((signal: Signal) => {
    setFormMode("edit");
    setSelectedSignalId(signal.id);
    setEditingSignal(signal as SignalDetailType);
    setShowFormModal(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: SignalCreateRequest | SignalUpdateRequest) => {
      if (formMode === "create") {
        await createSignal(data as SignalCreateRequest);
      } else if (selectedSignalId) {
        await updateSignal(selectedSignalId, data as SignalUpdateRequest);
      }
      setShowFormModal(false);
      setEditingSignal(null);
      setSelectedSignalId(null);
    },
    [formMode, selectedSignalId, createSignal, updateSignal]
  );

  const handleDeleteSignal = useCallback(
    async (signalId: string) => {
      if (window.confirm("Are you sure you want to delete this signal?")) {
        await deleteSignal(signalId);
      }
    },
    [deleteSignal]
  );

  const handleBulkDelete = useCallback(
    async (signalIds: string[]) => {
      await bulkDelete(signalIds);
    },
    [bulkDelete]
  );

  const handleCleanupExpired = useCallback(async () => {
    const result = await cleanupExpired();
    alert(result.message);
  }, [cleanupExpired]);

  const handleUpdateSignalStatus = useCallback(
    async (status: SignalStatus) => {
      if (!selectedSignalId) return;
      await updateSignal(selectedSignalId, { status });
      handleCloseDetailModal();
      fetchSignals();
    },
    [selectedSignalId, updateSignal, fetchSignals, handleCloseDetailModal]
  );

  const tabConfig: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      id: "signals",
      label: "Signals",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Admin Control Center
              </h1>
              <Badge variant="warning" size="sm">
                Admin
              </Badge>
            </div>
            <p className="text-slate-400 mt-1">
              Manage signals, analysis, and system settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <div
                className={`w-2 h-2 rounded-full ${
                  autoAnalysisConfig?.enabled
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-slate-500"
                }`}
              />
              <span className="text-sm text-slate-300">
                Auto-Analysis {autoAnalysisConfig?.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-slate-800/50 rounded-xl p-1.5 w-fit">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Signals</p>
                    <p className="text-3xl font-bold text-white">{signals.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Providers</p>
                    <p className="text-3xl font-bold text-white">{activeProviders.length}</p>
                  </div>
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border-sky-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Pending Requests</p>
                    <p className="text-3xl font-bold text-white">
                      {recentRequests.filter(r => r.status === "pending" || r.status === "processing").length}
                    </p>
                  </div>
                  <div className="p-3 bg-sky-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Auto-Analysis</p>
                    <p className="text-3xl font-bold text-white">
                      {autoAnalysisConfig?.enabled ? "ON" : "OFF"}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="primary"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={handleCreateSignal}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Signal
                </Button>
                <Button
                  variant="secondary"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab("analysis")}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Trigger Analysis
                </Button>
                <Button
                  variant="secondary"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => actions.toggleAutoAnalysis(!autoAnalysisConfig?.enabled)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Toggle Auto-Analysis
                </Button>
                <Button
                  variant="secondary"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={handleCleanupExpired}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Cleanup Expired
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Signals */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Signals</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("signals")}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {signals.slice(0, 5).map((signal) => (
                    <div
                      key={signal.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => handleViewSignal(signal)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{signal.symbol}</span>
                        <Badge
                          variant={signal.decision === "long" ? "success" : signal.decision === "short" ? "danger" : "default"}
                          size="sm"
                        >
                          {signal.decision.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-400">
                        {signal.consensus_strength.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                  {signals.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No signals yet</p>
                  )}
                </div>
              </Card>

              {/* Recent Analysis Requests */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Analysis Requests</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("analysis")}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {request.symbols.join(", ")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(request.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === "completed" ? "success" :
                          request.status === "processing" ? "info" :
                          request.status === "failed" ? "danger" : "warning"
                        }
                        size="sm"
                        dot
                        pulse={request.status === "processing"}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                  {recentRequests.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No requests yet</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "signals" && (
          <AdminSignalsManagement
            signals={signals}
            isLoading={isLoadingSignals}
            error={signalsError}
            filters={filters}
            onFilterChange={updateFilters}
            onCreateSignal={handleCreateSignal}
            onEditSignal={handleEditSignal}
            onDeleteSignal={handleDeleteSignal}
            onBulkDelete={handleBulkDelete}
            onCleanupExpired={handleCleanupExpired}
            onViewSignal={handleViewSignal}
            availableSymbols={symbols}
          />
        )}

        {activeTab === "analysis" && (
          <AdminAnalysisDashboard
            settings={settings}
            autoAnalysisConfig={autoAnalysisConfig}
            providers={providers}
            activeProviders={activeProviders}
            recentRequests={recentRequests}
            isLoading={isLoadingDashboard}
            onToggleAutoAnalysis={actions.toggleAutoAnalysis}
            onConfigureAutoAnalysis={actions.configureAutoAnalysis}
            onConfigureProviders={actions.configureProviders}
            onTriggerAnalysis={triggerAsync}
          />
        )}
      </div>

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        isLoading={isLoadingDetail}
        onUpdateStatus={handleUpdateSignalStatus}
        isAdmin={true}
        onEdit={() => {
          handleCloseDetailModal();
          if (selectedSignal) {
            handleEditSignal(selectedSignal as Signal);
          }
        }}
        onDelete={() => {
          if (selectedSignalId && window.confirm("Delete this signal?")) {
            deleteSignal(selectedSignalId);
            handleCloseDetailModal();
          }
        }}
      />

      {/* Signal Form Modal */}
      <SignalForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingSignal(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSignal}
        isLoading={isLoadingSignals}
        mode={formMode}
        availableSymbols={symbols}
      />
    </div>
  );
};

export default AdminDashboard;