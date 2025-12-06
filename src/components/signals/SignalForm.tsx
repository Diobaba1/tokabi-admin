// =============================================================================
// FILE: src/components/signals/SignalForm.tsx
// =============================================================================
// Signal Create/Edit Form Component
// =============================================================================

import React, { useState, useEffect } from "react";
import {
  SignalDecision,
  SignalStatus,
  SignalCreateRequest,
  SignalUpdateRequest,
  SignalDetail,
} from "../../types";
import { Modal, Button, Input, Select } from "../ui";

interface SignalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignalCreateRequest | SignalUpdateRequest) => Promise<void>;
  initialData?: SignalDetail | null;
  isLoading?: boolean;
  mode: "create" | "edit";
  availableSymbols?: string[];
}

export const SignalForm: React.FC<SignalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode,
  availableSymbols = [],
}) => {
  const [formData, setFormData] = useState<SignalCreateRequest>({
    symbol: "",
    decision: SignalDecision.LONG,
    consensus_strength: 85,
    avg_confidence: 0.8,
    entry_price: undefined,
    stop_loss_price: undefined,
    take_profit_price: undefined,
    risk_reward_ratio: undefined,
    suggested_leverage: undefined,
    current_price: undefined,
    custom_context: "",
    admin_notes: "",
    timeframes_analyzed: ["5m", "1h", "4h"],
    expires_in_hours: 4,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        symbol: initialData.symbol,
        decision: initialData.decision,
        consensus_strength: initialData.consensus_strength,
        avg_confidence: initialData.avg_confidence,
        entry_price: initialData.entry_price || undefined,
        stop_loss_price: initialData.stop_loss_price || undefined,
        take_profit_price: initialData.take_profit_price || undefined,
        risk_reward_ratio: initialData.risk_reward_ratio || undefined,
        suggested_leverage: initialData.suggested_leverage || undefined,
        current_price: initialData.current_price || undefined,
        custom_context: initialData.custom_context || "",
        admin_notes: initialData.admin_notes || "",
        timeframes_analyzed: initialData.timeframes_analyzed || ["5m", "1h", "4h"],
        expires_in_hours: 4,
      });
    } else if (mode === "create") {
      setFormData({
        symbol: "",
        decision: SignalDecision.LONG,
        consensus_strength: 85,
        avg_confidence: 0.8,
        entry_price: undefined,
        stop_loss_price: undefined,
        take_profit_price: undefined,
        risk_reward_ratio: undefined,
        suggested_leverage: undefined,
        current_price: undefined,
        custom_context: "",
        admin_notes: "",
        timeframes_analyzed: ["5m", "1h", "4h"],
        expires_in_hours: 4,
      });
    }
  }, [initialData, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol) {
      newErrors.symbol = "Symbol is required";
    }

    if (formData.decision !== SignalDecision.HOLD) {
      if (!formData.entry_price || formData.entry_price <= 0) {
        newErrors.entry_price = "Entry price is required";
      }

      // Validate price logic for long positions
      if (formData.decision === SignalDecision.LONG) {
        if (
          formData.stop_loss_price &&
          formData.entry_price &&
          formData.stop_loss_price >= formData.entry_price
        ) {
          newErrors.stop_loss_price = "Stop loss must be below entry for long";
        }
        if (
          formData.take_profit_price &&
          formData.entry_price &&
          formData.take_profit_price <= formData.entry_price
        ) {
          newErrors.take_profit_price = "Take profit must be above entry for long";
        }
      }

      // Validate price logic for short positions
      if (formData.decision === SignalDecision.SHORT) {
        if (
          formData.stop_loss_price &&
          formData.entry_price &&
          formData.stop_loss_price <= formData.entry_price
        ) {
          newErrors.stop_loss_price = "Stop loss must be above entry for short";
        }
        if (
          formData.take_profit_price &&
          formData.entry_price &&
          formData.take_profit_price >= formData.entry_price
        ) {
          newErrors.take_profit_price = "Take profit must be below entry for short";
        }
      }
    }

    if (
      formData.suggested_leverage &&
      (formData.suggested_leverage < 1 || formData.suggested_leverage > 125)
    ) {
      newErrors.suggested_leverage = "Leverage must be between 1 and 125";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Error handling is done in parent
    }
  };

  const handleChange = (
    field: keyof SignalCreateRequest,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const decisionOptions = [
    { value: SignalDecision.LONG, label: "Long" },
    { value: SignalDecision.SHORT, label: "Short" },
    { value: SignalDecision.HOLD, label: "Hold" },
  ];

  const symbolOptions =
    availableSymbols.length > 0
      ? [
          { value: "", label: "Select Symbol" },
          ...availableSymbols.map((s) => ({ value: s, label: s })),
        ]
      : [{ value: "", label: "Enter Symbol" }];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Signal" : "Edit Signal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          {availableSymbols.length > 0 ? (
            <Select
              label="Symbol"
              options={symbolOptions}
              value={formData.symbol}
              onChange={(e) => handleChange("symbol", e.target.value)}
              error={errors.symbol}
            />
          ) : (
            <Input
              label="Symbol"
              placeholder="BTCUSDT"
              value={formData.symbol}
              onChange={(e) => handleChange("symbol", e.target.value.toUpperCase())}
              error={errors.symbol}
            />
          )}
          <Select
            label="Decision"
            options={decisionOptions}
            value={formData.decision}
            onChange={(e) => handleChange("decision", e.target.value as SignalDecision)}
          />
        </div>

        {/* Price Levels */}
        {formData.decision !== SignalDecision.HOLD && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Price Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Current Price"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.current_price || ""}
                onChange={(e) =>
                  handleChange(
                    "current_price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              <Input
                label="Entry Price"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.entry_price || ""}
                onChange={(e) =>
                  handleChange(
                    "entry_price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                error={errors.entry_price}
              />
              <Input
                label="Stop Loss"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.stop_loss_price || ""}
                onChange={(e) =>
                  handleChange(
                    "stop_loss_price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                error={errors.stop_loss_price}
              />
              <Input
                label="Take Profit"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.take_profit_price || ""}
                onChange={(e) =>
                  handleChange(
                    "take_profit_price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                error={errors.take_profit_price}
              />
            </div>
          </div>
        )}

        {/* Risk Parameters */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Risk Parameters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Consensus %"
              type="number"
              min="0"
              max="100"
              value={formData.consensus_strength || ""}
              onChange={(e) =>
                handleChange(
                  "consensus_strength",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
            <Input
              label="Confidence (0-1)"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.avg_confidence || ""}
              onChange={(e) =>
                handleChange(
                  "avg_confidence",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
            <Input
              label="R:R Ratio"
              type="number"
              step="0.1"
              min="0"
              value={formData.risk_reward_ratio || ""}
              onChange={(e) =>
                handleChange(
                  "risk_reward_ratio",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
            <Input
              label="Leverage"
              type="number"
              step="0.1"
              min="1"
              max="125"
              value={formData.suggested_leverage || ""}
              onChange={(e) =>
                handleChange(
                  "suggested_leverage",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              error={errors.suggested_leverage}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Additional Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Custom Context
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
                rows={3}
                placeholder="Additional analysis context..."
                value={formData.custom_context || ""}
                onChange={(e) => handleChange("custom_context", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Admin Notes
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
                rows={2}
                placeholder="Internal notes..."
                value={formData.admin_notes || ""}
                onChange={(e) => handleChange("admin_notes", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Expiry */}
        {mode === "create" && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expires In (hours)"
              type="number"
              min="1"
              max="72"
              value={formData.expires_in_hours || ""}
              onChange={(e) =>
                handleChange(
                  "expires_in_hours",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {mode === "create" ? "Create Signal" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SignalForm;