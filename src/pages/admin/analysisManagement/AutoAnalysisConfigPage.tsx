// =============================================================================
// FILE: src/pages/admin/analysis/AutoAnalysisConfigPage.tsx
// =============================================================================
// Auto-Analysis Configuration Page
// =============================================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useAdminSettings,
  useAutoAnalysis,
  useLLMProviders,
} from "../../../components/hooks";
import {
  Card,
  Button,
  Input,
  Toggle,
  Badge,
  Spinner,
  StatCard,
} from "../../../components/ui";

const AutoAnalysisConfigPage: React.FC = () => {
  // Hooks
  const { settings, isLoading: isLoadingSettings, updateSettings } = useAdminSettings();
  const { config, isLoading: isLoadingConfig, toggle, configure, fetchStatus } = useAutoAnalysis();
  const { providers, activeProviders, isLoading: isLoadingProviders, configureProviders } = useLLMProviders();

  // Local state for form
  const [symbols, setSymbols] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [minConsensus, setMinConsensus] = useState(75);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form from config
  useEffect(() => {
    if (config) {
      setSymbols(config.symbols?.join(", ") || "");
      setIntervalMinutes(config.interval_minutes || 60);
    }
  }, [config]);

  useEffect(() => {
    if (activeProviders.length > 0) {
      setSelectedProviders(activeProviders);
    }
  }, [activeProviders]);

  useEffect(() => {
    if (settings) {
      setMinConsensus(settings.min_consensus_for_execution || 75);
    }
  }, [settings]);

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Save auto-analysis configuration
      await configure({
        symbols: symbols.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
        interval_minutes: intervalMinutes,
      });

      // Save provider selection
      await configureProviders(selectedProviders);

      // Save settings if changed
      if (settings?.min_consensus_for_execution !== minConsensus) {
        await updateSettings({ min_consensus_for_execution: minConsensus });
      }

      alert("Configuration saved successfully!");
    } catch (error) {
      alert("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAutoAnalysis = async () => {
    await toggle(!config?.enabled);
    await fetchStatus();
  };

  const isLoading = isLoadingSettings || isLoadingConfig || isLoadingProviders;

  if (isLoading && !config) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Auto-Analysis Configuration</h1>
          <p className="text-slate-400 mt-1">
            Configure automatic market analysis settings
          </p>
        </div>
        <Link to="/admin/trading-bot/analysis">
          <Button variant="secondary">
            Back to Analysis Control
          </Button>
        </Link>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Status"
          value={config?.enabled ? "Active" : "Disabled"}
          icon={
            <div
              className={`w-3 h-3 rounded-full ${
                config?.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
              }`}
            />
          }
        />
        <StatCard
          label="Interval"
          value={`${config?.interval_minutes || 60} min`}
        />
        <StatCard
          label="Symbols"
          value={config?.symbols?.length || 0}
        />
        <StatCard
          label="Last Run"
          value={
            config?.last_run
              ? new Date(config.last_run).toLocaleTimeString()
              : "Never"
          }
        />
      </div>

      {/* Main Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Enable Auto-Analysis</h2>
            <p className="text-sm text-slate-400 mt-1">
              When enabled, the system will automatically analyze configured symbols at the specified interval
            </p>
          </div>
          <Toggle
            enabled={config?.enabled || false}
            onChange={handleToggleAutoAnalysis}
            disabled={isLoading}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Configuration */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Schedule</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Symbols to Analyze (comma-separated)
              </label>
              <Input
                placeholder="BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to analyze all available symbols
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Analysis Interval (minutes)
              </label>
              <Input
                type="number"
                min={5}
                max={1440}
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 60)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Minimum: 5 minutes, Maximum: 1440 minutes (24 hours)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Minimum Consensus for Signal Creation (%)
              </label>
              <Input
                type="number"
                min={50}
                max={100}
                value={minConsensus}
                onChange={(e) => setMinConsensus(parseInt(e.target.value) || 75)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Signals with lower consensus will not be created
              </p>
            </div>
          </div>
        </Card>

        {/* Provider Selection */}
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
                        ? selectedProviders.includes(name)
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-pointer"
                        : "bg-slate-900/50 border-slate-800 opacity-50"
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
                    {info.configured ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              ))}
          </div>

          <div className="mt-4 p-3 bg-slate-800/30 rounded-xl">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">{selectedProviders.length}</strong> provider(s) selected. 
              For best results, use at least 3 providers for consensus.
            </p>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Link to="/admin/trading-bot/analysis">
          <Button variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          onClick={handleSaveConfig}
          isLoading={isSaving}
          disabled={selectedProviders.length === 0}
        >
          Save Configuration
        </Button>
      </div>

      {/* Last Run Info */}
      {config?.last_run && (
        <Card className="p-4 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Last Analysis Run</p>
              <p className="text-sm text-slate-200">
                {new Date(config.last_run).toLocaleString()}
              </p>
            </div>
            {config.enabled && (
              <div>
                <p className="text-sm text-slate-400">Next Run</p>
                <p className="text-sm text-slate-200">
                  {new Date(
                    new Date(config.last_run).getTime() + (config.interval_minutes || 60) * 60 * 1000
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AutoAnalysisConfigPage;