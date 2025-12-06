// =============================================================================
// FILE: src/components/signals/SignalCard.tsx
// =============================================================================
// Signal Card Component - Displays individual signal with rich details
// =============================================================================

import React from "react";
import { Signal, SignalDecision, SignalStatus, SignalSource } from "../../types";
import {
  Card,
  SignalDecisionBadge,
  SignalStatusBadge,
  SignalSourceBadge,
  ProgressBar,
} from "../ui";

interface SignalCardProps {
  signal: Signal;
  onClick?: (signal: Signal) => void;
  showDetails?: boolean;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onClick,
  showDetails = true,
}) => {
  const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return price >= 1 ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : price.toFixed(6);
  };

  const formatPercent = (value: number | null) => {
    if (!value) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const consensusVariant = (): "success" | "warning" | "danger" => {
    if (signal.consensus_strength >= 80) return "success";
    if (signal.consensus_strength >= 60) return "warning";
    return "danger";
  };

  return (
    <Card
      hover
      className={`
        p-5 cursor-pointer transition-all duration-300
        ${onClick ? "hover:scale-[1.01] hover:border-emerald-500/30" : ""}
      `}
    >
      <div onClick={() => onClick?.(signal)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">
                {signal.symbol}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <SignalSourceBadge source={signal.source as SignalSource} />
                <SignalStatusBadge status={signal.status as SignalStatus} />
              </div>
            </div>
          </div>
          <SignalDecisionBadge decision={signal.decision as SignalDecision} size="lg" />
        </div>

        {/* Consensus Strength */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Consensus Strength
            </span>
            <span className="text-sm font-bold text-white">
              {signal.consensus_strength.toFixed(1)}%
            </span>
          </div>
          <ProgressBar
            value={signal.consensus_strength}
            variant={consensusVariant()}
          />
        </div>

        {/* Price Levels */}
        {showDetails && signal.decision !== SignalDecision.HOLD && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Entry</p>
              <p className="text-sm font-semibold text-white">
                ${formatPrice(signal.entry_price)}
              </p>
            </div>
            <div className="bg-rose-500/10 rounded-xl p-3 text-center border border-rose-500/20">
              <p className="text-xs text-rose-400 uppercase tracking-wider mb-1">Stop Loss</p>
              <p className="text-sm font-semibold text-rose-400">
                ${formatPrice(signal.stop_loss_price)}
              </p>
              {signal.stop_loss_percent && (
                <p className="text-xs text-rose-400/70">
                  {formatPercent(-Math.abs(signal.stop_loss_percent))}
                </p>
              )}
            </div>
            <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Take Profit</p>
              <p className="text-sm font-semibold text-emerald-400">
                ${formatPrice(signal.take_profit_price)}
              </p>
              {signal.take_profit_percent && (
                <p className="text-xs text-emerald-400/70">
                  {formatPercent(signal.take_profit_percent)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-4">
            {signal.suggested_leverage && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">⚡</span>
                <span>{signal.suggested_leverage.toFixed(1)}x</span>
              </div>
            )}
            {signal.risk_reward_ratio && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">📊</span>
                <span>R:R {signal.risk_reward_ratio.toFixed(2)}</span>
              </div>
            )}
            {signal.active_providers && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">🤖</span>
                <span>{signal.active_providers} LLMs</span>
              </div>
            )}
          </div>
          <span>{formatDate(signal.created_at)}</span>
        </div>
      </div>
    </Card>
  );
};

export default SignalCard;