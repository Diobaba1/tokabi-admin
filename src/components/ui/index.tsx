

// =============================================================================
// FILE: src/components/ui/index.tsx
// =============================================================================
// Reusable UI Components with stunning design
// =============================================================================

import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { SignalDecision, SignalStatus, SignalSource } from "../../types";


export * from './Button';
export * from './Input';


// =============================================================================
// Button Component
// =============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

    const variants = {
      primary:
        "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-500 border border-slate-700",
      danger:
        "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 focus:ring-rose-500 shadow-lg shadow-rose-500/25",
      success:
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500",
      ghost: "text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500",
      outline:
        "border-2 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 focus:ring-emerald-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

// =============================================================================
// Input Component
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100
            placeholder:text-slate-500 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
            ${error ? "border-rose-500" : "border-slate-700 hover:border-slate-600"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

// =============================================================================
// Select Component
// =============================================================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">{label}</label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
            ${error ? "border-rose-500" : "border-slate-700 hover:border-slate-600"}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

// =============================================================================
// Card Component
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  gradient = false,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-slate-800/50
        ${gradient ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-slate-900/50"}
        ${hover ? "transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-900/50" : ""}
        backdrop-blur-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// =============================================================================
// Badge Component
// =============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
}) => {
  const variants = {
    default: "bg-slate-700/50 text-slate-300 border-slate-600",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  };

  const dotColors = {
    default: "bg-slate-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-rose-400",
    info: "bg-sky-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variants[variant]} ${sizes[size]}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
};

// =============================================================================
// Signal Decision Badge
// =============================================================================

interface SignalDecisionBadgeProps {
  decision: SignalDecision;
  size?: "sm" | "md" | "lg";
}

export const SignalDecisionBadge: React.FC<SignalDecisionBadgeProps> = ({
  decision,
  size = "md",
}) => {
  const config = {
    [SignalDecision.LONG]: {
      label: "LONG",
      icon: "↑",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    },
    [SignalDecision.SHORT]: {
      label: "SHORT",
      icon: "↓",
      className: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    },
    [SignalDecision.HOLD]: {
      label: "HOLD",
      icon: "→",
      className: "bg-slate-500/20 text-slate-400 border-slate-500/40",
    },
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const { label, icon, className } = config[decision];

  return (
    <span
      className={`
        inline-flex items-center font-bold rounded-lg border
        ${className} ${sizes[size]}
      `}
    >
      <span className={size === "lg" ? "text-xl" : ""}>{icon}</span>
      {label}
    </span>
  );
};

// =============================================================================
// Signal Status Badge
// =============================================================================

interface SignalStatusBadgeProps {
  status: SignalStatus;
}

export const SignalStatusBadge: React.FC<SignalStatusBadgeProps> = ({ status }) => {
  const config = {
    [SignalStatus.ACTIVE]: { variant: "success" as const, dot: true, pulse: true },
    [SignalStatus.EXPIRED]: { variant: "warning" as const, dot: true, pulse: false },
    [SignalStatus.EXECUTED]: { variant: "info" as const, dot: true, pulse: false },
    [SignalStatus.CANCELLED]: { variant: "danger" as const, dot: true, pulse: false },
    [SignalStatus.PARTIAL]: { variant: "warning" as const, dot: true, pulse: true },
  };

  const { variant, dot, pulse } = config[status];

  return (
    <Badge variant={variant} dot={dot} pulse={pulse}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// =============================================================================
// Signal Source Badge
// =============================================================================

interface SignalSourceBadgeProps {
  source: SignalSource;
}

export const SignalSourceBadge: React.FC<SignalSourceBadgeProps> = ({ source }) => {
  const config = {
    [SignalSource.AUTO_ANALYSIS]: { label: "Auto", variant: "info" as const },
    [SignalSource.ADMIN_TRIGGERED]: { label: "Admin", variant: "warning" as const },
    [SignalSource.USER_REQUEST]: { label: "User", variant: "default" as const },
    [SignalSource.MANUAL]: { label: "Manual", variant: "success" as const },
  };

  const { label, variant } = config[source];

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
};

// =============================================================================
// Loading Spinner
// =============================================================================

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]} animate-spin rounded-full
          border-2 border-slate-700 border-t-emerald-500
        `}
      />
    </div>
  );
};

// =============================================================================
// Empty State
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-slate-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

// =============================================================================
// Stat Card
// =============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
}) => {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-slate-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <Card className="p-6" hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {(subValue || trendValue) && (
            <div className="flex items-center gap-2">
              {trendValue && trend && (
                <span className={`text-sm font-medium ${trendColors[trend]}`}>
                  {trendIcons[trend]} {trendValue}
                </span>
              )}
              {subValue && <span className="text-sm text-slate-500">{subValue}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-slate-800/50 rounded-xl text-slate-400">{icon}</div>
        )}
      </div>
    </Card>
  );
};

// =============================================================================
// Toggle Switch
// =============================================================================

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="mr-4">
          {label && <p className="text-sm font-medium text-slate-200">{label}</p>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
          ${enabled ? "bg-emerald-500" : "bg-slate-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-6 w-6 transform rounded-full
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${enabled ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};

// =============================================================================
// Progress Bar
// =============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  variant = "default",
  size = "md",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: "bg-emerald-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-slate-500 text-right">{percentage.toFixed(0)}%</p>
      )}
    </div>
  );
};

// =============================================================================
// Modal Component
// =============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`
            relative w-full ${sizes[size]} transform overflow-hidden rounded-2xl
            bg-slate-900 border border-slate-800 shadow-2xl
            transition-all duration-300 ease-out
          `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};