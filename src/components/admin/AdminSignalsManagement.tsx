// =============================================================================
// FILE: src/components/admin/AdminSignalsManagement.tsx
// =============================================================================
// Admin Signals Management - Full CRUD capabilities
// =============================================================================

import React, { useState } from "react";
import {
  Signal,
  SignalDetail,
  SignalFilterParams,
  SignalCreateRequest,
  SignalUpdateRequest,
  SignalDecision,
  SignalStatus,
  SignalSource,
} from "../../types";
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  EmptyState,
  SignalDecisionBadge,
  SignalStatusBadge,
  SignalSourceBadge,
} from "../ui";

interface AdminSignalsManagementProps {
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  filters: SignalFilterParams;
  onFilterChange: (filters: Partial<SignalFilterParams>) => void;
  onCreateSignal: () => void;
  onEditSignal: (signal: Signal) => void;
  onDeleteSignal: (signalId: string) => void;
  onBulkDelete: (signalIds: string[]) => void;
  onCleanupExpired: () => void;
  onViewSignal: (signal: Signal) => void;
  availableSymbols?: string[];
}

export const AdminSignalsManagement: React.FC<AdminSignalsManagementProps> = ({
  signals,
  isLoading,
  error,
  filters,
  onFilterChange,
  onCreateSignal,
  onEditSignal,
  onDeleteSignal,
  onBulkDelete,
  onCleanupExpired,
  onViewSignal,
  availableSymbols = [],
}) => {
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSelection = (signalId: string) => {
    setSelectedSignals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(signalId)) {
        newSet.delete(signalId);
      } else {
        newSet.add(signalId);
      }
      return newSet;
    });
  };

  const toggleAllSelection = () => {
    if (selectedSignals.size === signals.length) {
      setSelectedSignals(new Set());
    } else {
      setSelectedSignals(new Set(signals.map((s) => s.id)));
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedSignals));
    setSelectedSignals(new Set());
    setShowDeleteConfirm(false);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return `$${price >= 1 ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : price.toFixed(6)}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const decisionOptions = [
    { value: "", label: "All Decisions" },
    { value: SignalDecision.LONG, label: "Long" },
    { value: SignalDecision.SHORT, label: "Short" },
    { value: SignalDecision.HOLD, label: "Hold" },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: SignalStatus.ACTIVE, label: "Active" },
    { value: SignalStatus.EXPIRED, label: "Expired" },
    { value: SignalStatus.EXECUTED, label: "Executed" },
    { value: SignalStatus.CANCELLED, label: "Cancelled" },
  ];

  const sourceOptions = [
    { value: "", label: "All Sources" },
    { value: SignalSource.AUTO_ANALYSIS, label: "Auto" },
    { value: SignalSource.ADMIN_TRIGGERED, label: "Admin" },
    { value: SignalSource.USER_REQUEST, label: "User" },
    { value: SignalSource.MANUAL, label: "Manual" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Signal Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and manage trading signals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onCleanupExpired}>
            Cleanup Expired
          </Button>
          <Button variant="primary" onClick={onCreateSignal}>
            + Create Signal
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search symbol..."
            value={filters.symbol || ""}
            onChange={(e) =>
              onFilterChange({ symbol: e.target.value.toUpperCase() || undefined })
            }
          />
          <Select
            options={decisionOptions}
            value={filters.decision || ""}
            onChange={(e) =>
              onFilterChange({
                decision: (e.target.value as SignalDecision) || undefined,
              })
            }
          />
          <Select
            options={statusOptions}
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                status: (e.target.value as SignalStatus) || undefined,
              })
            }
          />
          <Select
            options={sourceOptions}
            value={filters.source || ""}
            onChange={(e) =>
              onFilterChange({
                source: (e.target.value as SignalSource) || undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Min consensus %"
            value={filters.min_consensus || ""}
            onChange={(e) =>
              onFilterChange({
                min_consensus: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedSignals.size > 0 && (
        <Card className="p-4 bg-slate-800/80 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">
              {selectedSignals.size} signal{selectedSignals.size !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSignals(new Set())}
              >
                Clear Selection
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Card className="p-4 bg-rose-500/10 border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-rose-200">
              Are you sure you want to delete {selectedSignals.size} signal
              {selectedSignals.size !== 1 ? "s" : ""}? This action cannot be undone.
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="p-8">
          <EmptyState
            title="Error Loading Signals"
            description={error}
            action={
              <Button variant="secondary" onClick={() => onFilterChange({})}>
                Try Again
              </Button>
            }
          />
        </Card>
      )}

      {/* Signals Table */}
      {!isLoading && !error && signals.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSignals.size === signals.length && signals.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Decision
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Consensus
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Leverage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {signals.map((signal) => (
                  <tr
                    key={signal.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSignals.has(signal.id)}
                        onChange={() => toggleSelection(signal.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewSignal(signal)}
                        className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                      >
                        {signal.symbol}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <SignalDecisionBadge
                        decision={signal.decision as SignalDecision}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          signal.consensus_strength >= 80
                            ? "text-emerald-400"
                            : signal.consensus_strength >= 60
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      >
                        {signal.consensus_strength.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {formatPrice(signal.entry_price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-400">
                      {signal.suggested_leverage
                        ? `${signal.suggested_leverage.toFixed(1)}x`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <SignalSourceBadge source={signal.source as SignalSource} />
                    </td>
                    <td className="px-4 py-3">
                      <SignalStatusBadge status={signal.status as SignalStatus} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(signal.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditSignal(signal)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300"
                          onClick={() => onDeleteSignal(signal.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && signals.length === 0 && (
        <Card className="p-8">
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="No Signals Found"
            description="No signals match your current filters, or no signals have been created yet."
            action={
              <Button variant="primary" onClick={onCreateSignal}>
                Create First Signal
              </Button>
            }
          />
        </Card>
      )}

      {/* Results Count */}
      {!isLoading && signals.length > 0 && (
        <div className="text-center text-sm text-slate-500">
          Showing {signals.length} signal{signals.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default AdminSignalsManagement;