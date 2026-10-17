import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { BrutalButton } from './BrutalButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="border-[2px] border-[#171717] bg-[#EDE8DD] p-10 text-center flex flex-col items-center justify-center my-6 shadow-[4px_4px_0px_#171717]">
      <div className="w-14 h-14 bg-white border-[2px] border-[#171717] flex items-center justify-center mb-4 shadow-[2px_2px_0px_#171717]">
        {icon || <Inbox className="w-7 h-7 text-[#171717]" />}
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tight text-[#171717] mb-2 font-display">
        {title}
      </h3>
      <p className="text-sm text-[#171717]/80 max-w-md mb-6 font-medium">
        {description}
      </p>
      {actionText && onAction && (
        <BrutalButton variant="primary" onClick={onAction}>
          {actionText}
        </BrutalButton>
      )}
    </div>
  );
}
