import { Badge } from '@/components/ui/badge';
import type { OnboardingStatus } from '@/types';

interface StatusBadgeProps {
  status: OnboardingStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : 'outline';
  
  return (
    <Badge variant={variant}>
      {status.replace('_', ' ')}
    </Badge>
  );
};
