import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface UrgencyBannerProps {
  urgency: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function UrgencyBanner({ urgency, message, actionText, onAction }: UrgencyBannerProps) {
  const isHigh = urgency === 'critical' || urgency === 'high';
  const bgColor = isHigh ? 'bg-[#FF6B4A] text-white' : 'bg-[#C8FF00] text-[#171717]';
  const Icon = isHigh ? AlertTriangle : AlertCircle;

  return (
    <div
      className={`border-[2px] border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex items-center justify-between gap-4 ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-bold text-sm tracking-wide uppercase">
          [{urgency.toUpperCase()}] {message}
        </span>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-white text-[#171717] border-[2px] border-[#171717] px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_#171717] hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
