import { useApp } from '@/contexts/AppContext';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const DemoBanner = () => {
  const { isDemoUser, logout } = useApp();
  const navigate = useNavigate();

  if (!isDemoUser()) return null;

  const handleExitDemo = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-primary/5 border-b border-primary/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-primary">
            You are exploring the DevHive demo workspace. Changes are shared by all visitors and reset periodically.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExitDemo}
          className="text-primary hover:text-primary/80 hover:bg-primary/10 flex-shrink-0"
        >
          <X className="w-4 h-4 mr-1" />
          Exit Demo
        </Button>
      </div>
    </div>
  );
};
