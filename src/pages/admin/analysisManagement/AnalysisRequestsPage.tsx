// =============================================================================
// FILE: src/pages/admin/analysis/AnalysisRequestsPage.tsx
// =============================================================================
// Analysis Requests History Page
// =============================================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAnalysisRequests } from "../../../components/hooks";
import { AnalysisRequestStatus } from "../../../types";
import {
  Card,
  Button,
  Badge,
  Spinner,
  ProgressBar,
  EmptyState,
  Select,
} from "../../../components/ui";

const AnalysisRequestsPage: React.FC = () => {
  // State
  const [statusFilter, setStatusFilter] = useState<AnalysisRequestStatus | "all">("all");

  // Hooks
  const { requests, isLoading, error, fetchRequests } = useAnalysisRequests(
    statusFilter === "all" ? undefined : statusFilter
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const formatDuration = (start: string, end: string | null) => {
    if (!end) return "In progress...";
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getStatusColor = (status: string): "success" | "info" | "warning" | "danger" | "default" => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "info";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  // Stats
  const stats = {
    total: requests.length,
    completed: requests.filter(r => r.status === "completed").length,
    processing: requests.filter(r => r.status === "processing").length,
    failed: requests.filter(r => r.status === "failed").length,
    totalSignals: requests.reduce((sum, r) => sum + r.signals_generated, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Requests</h1>
          <p className="text-slate-400 mt-1">
            History of all market analysis requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/trading-bot/analysis">
            <Button variant="secondary">
              Back to Analysis Control
            </Button>
          </Link>
          <Button variant="primary" onClick={() => fetchRequests()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
        </Card>
        <Card className="p-4 text-center bg-emerald-500/5 border-emerald-500/20">
          <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Completed</p>
        </Card>
        <Card className="p-4 text-center bg-sky-500/5 border-sky-500/20">
          <p className="text-2xl font-bold text-sky-400">{stats.processing}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Processing</p>
        </Card>
        <Card className="p-4 text-center bg-rose-500/5 border-rose-500/20">
          <p className="text-2xl font-bold text-rose-400">{stats.failed}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Failed</p>
        </Card>
        <Card className="p-4 text-center bg-amber-500/5 border-amber-500/20">
          <p className="text-2xl font-bold text-amber-400">{stats.totalSignals}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Signals Created</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AnalysisRequestStatus | "all")}
            />
          </div>
          <span className="text-sm text-slate-500">
            Showing {requests.length} request(s)
          </span>
        </div>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card className="p-6">
          <EmptyState
            title="Error Loading Requests"
            description={error}
            action={
              <Button variant="secondary" onClick={() => fetchRequests()}>
                Try Again
              </Button>
            }
          />
        </Card>
      ) : requests.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            title="No Analysis Requests"
            description={
              statusFilter === "all"
                ? "No analysis requests have been made yet"
                : `No ${statusFilter} requests found`
            }
            action={
              <Link to="/admin/trading-bot/analysis">
                <Button variant="primary">
                  Trigger Analysis
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6" hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={getStatusColor(request.status)}
                      dot
                      pulse={request.status === "processing"}
                    >
                      {request.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      ID: {request.id.slice(0, 8)}...
                    </span>
                  </div>

                  {/* Symbols */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-1">Symbols</p>
                    <div className="flex flex-wrap gap-2">
                      {request.symbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="px-2 py-1 bg-slate-800 rounded text-sm text-slate-200"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress (if processing) */}
                  {request.status === "processing" && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Progress</span>
                        <span className="text-sm text-slate-300">{request.progress}%</span>
                      </div>
                      <ProgressBar value={request.progress} size="sm" />
                    </div>
                  )}

                  {/* Error Message (if failed) */}
                  {request.status === "failed" && request.error_message && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                      <p className="text-sm text-rose-400">{request.error_message}</p>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Created</p>
                      <p className="text-slate-200">{formatDate(request.created_at)}</p>
                    </div>
                    {request.completed_at && (
                      <div>
                        <p className="text-slate-500">Completed</p>
                        <p className="text-slate-200">{formatDate(request.completed_at)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-500">Duration</p>
                      <p className="text-slate-200">
                        {formatDuration(request.created_at, request.completed_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Signals Generated</p>
                      <p className="text-slate-200 font-semibold">
                        {request.signals_generated}
                      </p>
                    </div>
                  </div>

                  {/* Custom Context (if present) */}
                  {request.custom_context && (
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Custom Context
                      </p>
                      <p className="text-sm text-slate-300">{request.custom_context}</p>
                    </div>
                  )}
                </div>

                {/* Right Side Stats */}
                <div className="ml-6 text-right">
                  <div className="text-3xl font-bold text-white">
                    {request.signals_generated}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Signals
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisRequestsPage;