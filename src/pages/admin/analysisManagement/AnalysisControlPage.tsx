// =============================================================================
// FILE: src/pages/admin/analysis/AnalysisControlPage.tsx
// =============================================================================
// Analysis Control Page - Trigger and monitor analysis
// =============================================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminDashboard,
  useAnalysisTrigger,
  useAnalysisRequests,
} from "../../../components/hooks";
import { AnalysisTriggerRequest } from "../../../types";
import {
  Card,
  Button,
  Input,
  Badge,
  Spinner,
  ProgressBar,
  StatCard,
} from "../../../components/ui";

const AnalysisControlPage: React.FC = () => {
  // State
  const [triggerSymbols, setTriggerSymbols] = useState("");
  const [triggerContext, setTriggerContext] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Hooks
  const {
    autoAnalysisConfig,
    providers,
    activeProviders,
    isLoading: isLoadingDashboard,
    actions,
  } = useAdminDashboard();

  const { triggerAsync, triggerSync, isLoading: isTriggeringAnalysis, lastResult } =
    useAnalysisTrigger();
  const { requests, isLoading: isLoadingRequests, fetchRequests } =
    useAnalysisRequests();

  // Initialize selected providers from active providers
  React.useEffect(() => {
    if (activeProviders.length > 0 && selectedProviders.length === 0) {
      setSelectedProviders(activeProviders);
    }
  }, [activeProviders, selectedProviders.length]);

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleTriggerAsync = async () => {
    if (!triggerSymbols.trim()) return;

    const request: AnalysisTriggerRequest = {
      symbols: triggerSymbols.split(",").map((s) => s.trim().toUpperCase()),
      custom_context: triggerContext || undefined,
      selected_providers: selectedProviders.length > 0 ? selectedProviders : undefined,
    };

    await triggerAsync(request);
    setTriggerSymbols("");
    setTriggerContext("");
    fetchRequests();
  };

  const handleTriggerSync = async () => {
    if (!triggerSymbols.trim()) return;

    const symbols = triggerSymbols.split(",").map((s) => s.trim().toUpperCase());
    if (symbols.length > 1) {
      alert("Sync analysis only supports a single symbol. Use background analysis for multiple symbols.");
      return;
    }

    const request: AnalysisTriggerRequest = {
      symbols,
      custom_context: triggerContext || undefined,
      selected_providers: selectedProviders.length > 0 ? selectedProviders : undefined,
    };

    await triggerSync(request);
    setTriggerSymbols("");
    setTriggerContext("");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Control</h1>
          <p className="text-slate-400 mt-1">
            Trigger and monitor LLM-powered market analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/trading-bot/analysis/auto-config">
            <Button variant="secondary">
              Configure Auto-Analysis
            </Button>
          </Link>
          <Link to="/admin/trading-bot/analysis/requests">
            <Button variant="secondary">
              View All Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Auto Analysis"
          value={autoAnalysisConfig?.enabled ? "Active" : "Disabled"}
          icon={
            <div
              className={`w-3 h-3 rounded-full ${
                autoAnalysisConfig?.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
              }`}
            />
          }
        />
        <StatCard
          label="Active Providers"
          value={activeProviders.length}
          subValue={`of ${providers?.configured_count || 0} configured`}
        />
        <StatCard
          label="Analysis Interval"
          value={`${autoAnalysisConfig?.interval_minutes || 60}m`}
        />
        <StatCard
          label="Pending Requests"
          value={requests.filter(r => r.status === "pending" || r.status === "processing").length}
        />
      </div>

      {/* Quick Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Auto-Analysis Status</h2>
            <p className="text-sm text-slate-400 mt-1">
              {autoAnalysisConfig?.enabled
                ? `Running every ${autoAnalysisConfig.interval_minutes} minutes for ${autoAnalysisConfig.symbols?.join(", ") || "all symbols"}`
                : "Automatic analysis is currently disabled"}
            </p>
          </div>
          <Button
            variant={autoAnalysisConfig?.enabled ? "danger" : "success"}
            onClick={() => actions.toggleAutoAnalysis(!autoAnalysisConfig?.enabled)}
            disabled={isLoadingDashboard}
          >
            {autoAnalysisConfig?.enabled ? "Disable" : "Enable"} Auto-Analysis
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Trigger */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Trigger Analysis</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Symbols (comma-separated)
              </label>
              <Input
                placeholder="BTCUSDT, ETHUSDT, BNBUSDT"
                value={triggerSymbols}
                onChange={(e) => setTriggerSymbols(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Custom Context (optional)
              </label>
              <Input
                placeholder="Focus on support levels, consider recent news..."
                value={triggerContext}
                onChange={(e) => setTriggerContext(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleTriggerAsync}
                isLoading={isTriggeringAnalysis}
                disabled={!triggerSymbols.trim() || selectedProviders.length === 0}
              >
                Run Background Analysis
              </Button>
              <Button
                variant="secondary"
                onClick={handleTriggerSync}
                isLoading={isTriggeringAnalysis}
                disabled={!triggerSymbols.trim() || selectedProviders.length === 0}
              >
                Run Sync (Single Symbol)
              </Button>
            </div>

            {lastResult && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-300">
                  Last result: {lastResult.signals_generated} signal(s) generated
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Provider Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Select Providers</h2>

          <div className="space-y-3">
            {providers?.providers &&
              Object.entries(providers.providers).map(([name, info]) => (
                <div
                  key={name}
                  className={`
                    flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                    ${
                      info.configured
                        ? selectedProviders.includes(name)
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        : "bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed"
                    }
                  `}
                  onClick={() => info.configured && handleProviderToggle(name)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(name)}
                      onChange={() => {}}
                      disabled={!info.configured}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-200 capitalize">
                        {name}
                      </p>
                      <p className="text-xs text-slate-500">{info.model}</p>
                    </div>
                  </div>
                  <Badge
                    variant={info.configured ? "success" : "default"}
                    size="sm"
                  >
                    {info.configured ? "Ready" : "Not Set"}
                  </Badge>
                </div>
              ))}
          </div>

          <p className="text-xs text-slate-500 mt-4">
            {selectedProviders.length} provider(s) selected for analysis
          </p>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Analysis Requests</h2>
          <Button variant="ghost" size="sm" onClick={() => fetchRequests()}>
            Refresh
          </Button>
        </div>

        {isLoadingRequests ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No analysis requests yet</p>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 10).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {request.symbols.join(", ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {request.status === "processing" && (
                    <div className="w-24">
                      <ProgressBar value={request.progress} size="sm" />
                    </div>
                  )}
                  <Badge
                    variant={getStatusColor(request.status)}
                    dot
                    pulse={request.status === "processing"}
                  >
                    {request.status}
                  </Badge>
                  {request.signals_generated > 0 && (
                    <span className="text-sm text-slate-400">
                      {request.signals_generated} signal{request.signals_generated !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {requests.length > 10 && (
          <div className="mt-4 text-center">
            <Link to="/admin/trading-bot/analysis/requests">
              <Button variant="ghost" size="sm">
                View All {requests.length} Requests
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalysisControlPage;