import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InsightsMetricCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const InsightsMetricCard = ({ title, description, icon: Icon, children }: InsightsMetricCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
