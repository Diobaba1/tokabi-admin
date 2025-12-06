// =============================================================================
// FILE: src/pages/UserDashboard.tsx
// =============================================================================
// User Dashboard Page - Main view for regular users
// =============================================================================

import React, { useState, useCallback } from "react";
import {
  useSignals,
  useActiveSignals,
  useSignalDetail,
  useSignalStats,
  useLeverageRecommendations,
  useAvailableSymbols,
  useSignalStatusUpdate,
} from "../components/hooks";
import { Signal, SignalDetail as SignalDetailType, SignalStatus } from "../types";
import { SignalsList } from "../components/signals/SignalsList";
import { SignalDetailModal } from "../components/signals/SignalDetailModal";
import { Card, StatCard, Badge, Spinner, Button } from "../components/ui";

const UserDashboard: React.FC = () => {
  // State
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "leverage">("active");

  // Hooks
  const { signals, isLoading, error, filters, fetchSignals, updateFilters, resetFilters } =
    useSignals();
  const {
    signals: activeSignals,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useActiveSignals();
  const { signal: selectedSignal, isLoading: isLoadingDetail } =
    useSignalDetail(selectedSignalId);
  const { stats, isLoading: isLoadingStats } = useSignalStats("24h");
  const { recommendations, isLoading: isLoadingRecs } = useLeverageRecommendations(
    undefined,
    80,
    5
  );
  const { symbols } = useAvailableSymbols();
  const { updateStatus, isLoading: isUpdatingStatus } = useSignalStatusUpdate();

  // Handlers
  const handleSignalClick = useCallback((signal: Signal) => {
    setSelectedSignalId(signal.id);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedSignalId(null);
  }, []);

  const handleUpdateStatus = useCallback(
    async (status: SignalStatus) => {
      if (!selectedSignalId) return;
      await updateStatus(selectedSignalId, status);
      handleCloseModal();
      fetchSignals();
      refetchActive();
    },
    [selectedSignalId, updateStatus, fetchSignals, refetchActive, handleCloseModal]
  );

  const displayedSignals = activeTab === "active" ? activeSignals : signals;
  const displayedLoading = activeTab === "active" ? isLoadingActive : isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Trading Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            AI-powered signals from multiple LLM consensus
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Signals (24h)"
            value={stats?.total_signals || 0}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatCard
            label="Long Signals"
            value={stats?.decisions?.long || 0}
            trend="up"
            trendValue={`${((stats?.decisions?.long || 0) / (stats?.total_signals || 1) * 100).toFixed(0)}%`}
            icon={
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            }
          />
          <StatCard
            label="Short Signals"
            value={stats?.decisions?.short || 0}
            trend="down"
            trendValue={`${((stats?.decisions?.short || 0) / (stats?.total_signals || 1) * 100).toFixed(0)}%`}
            icon={
              <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            }
          />
          <StatCard
            label="Avg Consensus"
            value={`${(stats?.avg_consensus_strength || 0).toFixed(1)}%`}
            subValue="Signal strength"
            icon={
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Signals List */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "active"
                    ? "bg-emerald-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Active Signals
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-emerald-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Signals
              </button>
            </div>

            <SignalsList
              signals={displayedSignals}
              isLoading={displayedLoading}
              error={error}
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
              onSignalClick={handleSignalClick}
              showFilters={activeTab === "all"}
              availableSymbols={symbols}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leverage Recommendations */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Top Opportunities
              </h3>
              {isLoadingRecs ? (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : recommendations.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No high-confidence signals available
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{rec.symbol}</span>
                        <Badge
                          variant={rec.decision === "long" ? "success" : "danger"}
                          size="sm"
                        >
                          {rec.decision.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          {rec.consensus_strength.toFixed(0)}% consensus
                        </span>
                        <span className="text-amber-400 font-medium">
                          {rec.suggested_leverage.toFixed(1)}x
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Most Active Symbols */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Most Active
              </h3>
              {isLoadingStats ? (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.most_active_symbols?.slice(0, 5).map((item, index) => (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-4">{index + 1}</span>
                        <span className="text-sm font-medium text-slate-200">
                          {item.symbol}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {item.count} signal{item.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => {
                    updateFilters({ min_consensus: 85 });
                    setActiveTab("all");
                  }}
                >
                  High Consensus (85%+)
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => {
                    updateFilters({ min_leverage: 5 });
                    setActiveTab("all");
                  }}
                >
                  High Leverage (5x+)
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => {
                    refetchActive();
                    fetchSignals();
                  }}
                >
                  Refresh Data
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        isLoading={isLoadingDetail}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default UserDashboard;