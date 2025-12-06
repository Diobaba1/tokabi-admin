// =============================================================================
// FILE: src/components/admin/AdminAnalysisDashboard.tsx
// =============================================================================
// Admin Analysis Dashboard - Settings, triggers, and monitoring
// =============================================================================

import React, { useState } from "react";
import {
  AdminSettings,
  AutoAnalysisConfig,
  AvailableLLMProviders,
  AnalysisRequest,
  AnalysisTriggerRequest,
} from "../../types";
import {
  Card,
  Button,
  Input,
  Toggle,
  Badge,
  StatCard,
  Spinner,
  ProgressBar,
} from "../ui";

interface AdminAnalysisDashboardProps {
  settings: AdminSettings | null;
  autoAnalysisConfig: AutoAnalysisConfig | null;
  providers: AvailableLLMProviders | null;
  activeProviders: string[];
  recentRequests: AnalysisRequest[];
  isLoading: boolean;
  onToggleAutoAnalysis: (enabled: boolean) => Promise<unknown>;
  onConfigureAutoAnalysis: (config: {
    symbols?: string[];
    timeframes?: string[];
    interval_minutes?: number;
  }) => Promise<unknown>;
  onConfigureProviders: (providers: string[]) => Promise<unknown>;
  onTriggerAnalysis: (data: AnalysisTriggerRequest) => Promise<unknown>;
}

export const AdminAnalysisDashboard: React.FC<AdminAnalysisDashboardProps> = ({
  settings,
  autoAnalysisConfig,
  providers,
  activeProviders,
  recentRequests,
  isLoading,
  onToggleAutoAnalysis,
  onConfigureAutoAnalysis,
  onConfigureProviders,
  onTriggerAnalysis,
}) => {
  const [triggerSymbols, setTriggerSymbols] = useState<string>("");
  const [triggerContext, setTriggerContext] = useState<string>("");
  const [isTriggeringAnalysis, setIsTriggeringAnalysis] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(activeProviders);
  const [configSymbols, setConfigSymbols] = useState<string>(
    autoAnalysisConfig?.symbols?.join(", ") || ""
  );
  const [configInterval, setConfigInterval] = useState<number>(
    autoAnalysisConfig?.interval_minutes || 60
  );

  const handleTriggerAnalysis = async () => {
    if (!triggerSymbols.trim()) return;

    setIsTriggeringAnalysis(true);
    try {
      await onTriggerAnalysis({
        symbols: triggerSymbols.split(",").map((s) => s.trim().toUpperCase()),
        custom_context: triggerContext || undefined,
        selected_providers: selectedProviders.length > 0 ? selectedProviders : undefined,
      });
      setTriggerSymbols("");
      setTriggerContext("");
    } finally {
      setIsTriggeringAnalysis(false);
    }
  };

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleSaveProviders = async () => {
    await onConfigureProviders(selectedProviders);
  };

  const handleSaveAutoConfig = async () => {
    await onConfigureAutoAnalysis({
      symbols: configSymbols.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      interval_minutes: configInterval,
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString();
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          label="Last Analysis"
          value={
            autoAnalysisConfig?.last_run
              ? new Date(autoAnalysisConfig.last_run).toLocaleTimeString()
              : "Never"
          }
        />
        <StatCard
          label="Analysis Interval"
          value={`${autoAnalysisConfig?.interval_minutes || 60}m`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto Analysis Control */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Auto Analysis</h2>
            <Toggle
              enabled={autoAnalysisConfig?.enabled || false}
              onChange={onToggleAutoAnalysis}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Symbols (comma-separated)
              </label>
              <Input
                placeholder="BTCUSDT, ETHUSDT, BNBUSDT"
                value={configSymbols}
                onChange={(e) => setConfigSymbols(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Interval (minutes)
              </label>
              <Input
                type="number"
                min={5}
                max={1440}
                value={configInterval}
                onChange={(e) => setConfigInterval(parseInt(e.target.value) || 60)}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSaveAutoConfig}
              disabled={isLoading}
            >
              Save Configuration
            </Button>
          </div>

          {autoAnalysisConfig?.last_run && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Last run: {formatDate(autoAnalysisConfig.last_run)}
              </p>
            </div>
          )}
        </Card>

        {/* LLM Providers */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">LLM Providers</h2>

          <div className="space-y-3">
            {providers?.providers &&
              Object.entries(providers.providers).map(([name, info]) => (
                <div
                  key={name}
                  className={`
                    flex items-center justify-between p-3 rounded-xl border transition-all
                    ${
                      info.configured
                        ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        : "bg-slate-900/50 border-slate-800 opacity-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(name)}
                      onChange={() => handleProviderToggle(name)}
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
                    {info.configured ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              ))}
          </div>

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={handleSaveProviders}
            disabled={isLoading || selectedProviders.length === 0}
          >
            Save Provider Selection
          </Button>
        </Card>
      </div>

      {/* Manual Trigger */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Trigger Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Symbols (comma-separated)
            </label>
            <Input
              placeholder="BTCUSDT, ETHUSDT"
              value={triggerSymbols}
              onChange={(e) => setTriggerSymbols(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Custom Context (optional)
            </label>
            <Input
              placeholder="Focus on support levels..."
              value={triggerContext}
              onChange={(e) => setTriggerContext(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleTriggerAnalysis}
            isLoading={isTriggeringAnalysis}
            disabled={!triggerSymbols.trim() || selectedProviders.length === 0}
          >
            Run Analysis (Background)
          </Button>
          <span className="text-sm text-slate-500">
            Using {selectedProviders.length} provider{selectedProviders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {/* Recent Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Analysis Requests</h2>

        {recentRequests.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No analysis requests yet</p>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
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
                    variant={getRequestStatusColor(request.status) as any}
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
      </Card>
    </div>
  );
};

export default AdminAnalysisDashboard;