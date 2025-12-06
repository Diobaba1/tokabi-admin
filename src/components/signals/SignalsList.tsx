// =============================================================================
// FILE: src/components/signals/SignalsList.tsx
// =============================================================================
// Signals List Component with filtering and sorting
// =============================================================================

import React, { useState } from "react";
import { Signal, SignalDecision, SignalStatus, SignalSource, SignalFilterParams } from "../../types";
import { SignalCard } from "./SignalCard";
import { Button, Select, Input, Card, Spinner, EmptyState } from "../ui";

interface SignalsListProps {
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  filters: SignalFilterParams;
  onFilterChange: (filters: Partial<SignalFilterParams>) => void;
  onResetFilters: () => void;
  onSignalClick: (signal: Signal) => void;
  showFilters?: boolean;
  availableSymbols?: string[];
}

export const SignalsList: React.FC<SignalsListProps> = ({
  signals,
  isLoading,
  error,
  filters,
  onFilterChange,
  onResetFilters,
  onSignalClick,
  showFilters = true,
  availableSymbols = [],
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    { value: SignalSource.AUTO_ANALYSIS, label: "Auto Analysis" },
    { value: SignalSource.ADMIN_TRIGGERED, label: "Admin Triggered" },
    { value: SignalSource.USER_REQUEST, label: "User Request" },
    { value: SignalSource.MANUAL, label: "Manual" },
  ];

  const symbolOptions = [
    { value: "", label: "All Symbols" },
    ...availableSymbols.map((s) => ({ value: s, label: s })),
  ];

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== "" && v !== null
  ).length;

  if (error) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          title="Error Loading Signals"
          description={error}
          action={
            <Button variant="secondary" onClick={() => onFilterChange({})}>
              Try Again
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? "Simple" : "Advanced"}
              </Button>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onResetFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              options={symbolOptions}
              value={filters.symbol || ""}
              onChange={(e) => onFilterChange({ symbol: e.target.value || undefined })}
            />
            <Select
              options={decisionOptions}
              value={filters.decision || ""}
              onChange={(e) =>
                onFilterChange({ decision: (e.target.value as SignalDecision) || undefined })
              }
            />
            <Select
              options={statusOptions}
              value={filters.status || ""}
              onChange={(e) =>
                onFilterChange({ status: (e.target.value as SignalStatus) || undefined })
              }
            />
            <Select
              options={sourceOptions}
              value={filters.source || ""}
              onChange={(e) =>
                onFilterChange({ source: (e.target.value as SignalSource) || undefined })
              }
            />
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                type="number"
                placeholder="Min Consensus %"
                value={filters.min_consensus || ""}
                onChange={(e) =>
                  onFilterChange({
                    min_consensus: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max Consensus %"
                value={filters.max_consensus || ""}
                onChange={(e) =>
                  onFilterChange({
                    max_consensus: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Min Leverage"
                value={filters.min_leverage || ""}
                onChange={(e) =>
                  onFilterChange({
                    min_leverage: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max Leverage"
                value={filters.max_leverage || ""}
                onChange={(e) =>
                  onFilterChange({
                    max_leverage: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          )}
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && signals.length === 0 && (
        <Card className="p-8">
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="No Signals Found"
            description={
              activeFilterCount > 0
                ? "Try adjusting your filters to see more results."
                : "No trading signals have been generated yet."
            }
            action={
              activeFilterCount > 0 ? (
                <Button variant="secondary" onClick={onResetFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        </Card>
      )}

      {/* Signals Grid */}
      {!isLoading && signals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onClick={onSignalClick}
            />
          ))}
        </div>
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

export default SignalsList;