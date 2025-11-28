import { useApp } from '@/contexts/AppContext';
import { AlertCircle } from 'lucide-react';

export const DemoBanner = () => {
  const { isDemoUser } = useApp();

  if (!isDemoUser()) return null;

  return (
    <div className="bg-primary/5 border-b border-primary/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-sm text-primary">
          You are exploring the DevHive demo workspace. Changes are shared by all visitors and reset periodically.
        </p>
      </div>
    </div>
  );
};
