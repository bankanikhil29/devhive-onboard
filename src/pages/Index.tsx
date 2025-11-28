import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { CheckCircle2, FileText, Users, BarChart3 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { loginAsGuest } = useApp();

  const handleTryDemo = async () => {
    await loginAsGuest();
    navigate('/dashboard');
  };

  const steps = [
    {
      number: '1',
      title: 'Create workspace & projects',
      description: 'Organize your teams by company and engineering project',
      icon: Users,
    },
    {
      number: '2',
      title: 'Add docs and templates',
      description: 'Build reusable onboarding checklists with linked documentation',
      icon: FileText,
    },
    {
      number: '3',
      title: 'Assign onboarding to new devs',
      description: 'Give new hires structured guidance with clear tasks and due dates',
      icon: CheckCircle2,
    },
    {
      number: '4',
      title: 'Track progress & outcomes',
      description: 'Monitor completion rates, identify at-risk items, and measure improvements',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
              DevHive
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Cut developer onboarding time in half
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Centralized documentation + guided checklists for engineering teams
            </p>
            <p className="text-sm text-muted-foreground/80 mb-8 max-w-xl mx-auto">
              The live demo uses sample data shared by all visitors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleTryDemo} className="min-w-[200px]">
                Try Live Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="min-w-[200px]">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to faster, more effective developer onboarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-primary mb-2">
                      Step {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" onClick={handleTryDemo}>
            Get Started with Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
