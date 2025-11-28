import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';

interface AtRiskBadgeProps {
  status: 'overdue' | 'due-soon' | 'on-time' | null;
}

export const AtRiskBadge = ({ status }: AtRiskBadgeProps) => {
  if (!status || status === 'on-time') return null;

  const config = {
    overdue: {
      label: 'Overdue',
      icon: AlertCircle,
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    },
    'due-soon': {
      label: 'Due Soon',
      icon: Clock,
      className: 'bg-amber-500 text-white hover:bg-amber-600',
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
};
