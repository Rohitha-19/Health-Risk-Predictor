import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'Low' | 'Moderate' | 'High';
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
      level === 'Low' && "bg-success/15 text-success",
      level === 'Moderate' && "bg-warning/15 text-warning",
      level === 'High' && "bg-destructive/15 text-destructive",
    )}>
      {level} Risk
    </span>
  );
}
