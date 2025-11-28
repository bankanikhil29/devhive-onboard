import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { CheckCircle2, FileText, Users, BarChart3, MessageSquare, Clock, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const navigate = useNavigate();
  const { loginAsDemo, submitWaitlist } = useApp();
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTryDemo = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitWaitlist(waitlistEmail, waitlistRole);
      toast({
        title: 'Welcome to the waitlist!',
        description: "We'll be in touch soon with early access.",
      });
      setWaitlistEmail('');
      setWaitlistRole('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join waitlist',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Centralized Documentation Hub',
      description: 'Organize architecture overviews, setup guides, and coding standards in one searchable place.',
    },
    {
      icon: CheckCircle2,
      title: 'Guided Onboarding Checklists',
      description: 'Reusable project-specific onboarding flows, assigned to each new developer with clear tasks.',
    },
    {
      icon: BarChart3,
      title: 'Progress & Insights',
      description: 'Track completion rates, see time-to-productivity metrics, and spot at-risk onboarding.',
    },
    {
      icon: MessageSquare,
      title: 'Comments & Collaboration',
      description: 'Discuss docs and onboarding tasks in context, not lost in Slack threads.',
    },
  ];

  const personas = [
    {
      icon: Users,
      title: 'Engineering Manager',
      pain: 'No visibility into onboarding status or time-to-productivity',
      solution: 'Real-time dashboards, insights, and standardized onboarding templates',
    },
    {
      icon: FileText,
      title: 'Tech Lead / Senior Developer',
      pain: 'Constant interruptions and repetitive onboarding questions',
      solution: 'Central docs with search, reusable checklists, and in-context comments',
    },
    {
      icon: CheckCircle2,
      title: 'New Developer',
      pain: 'Overwhelmed, scattered information, unclear expectations',
      solution: 'One place to see all docs, tasks, and progress with clear guidance',
    },
  ];

  return (
    <div className="min-h-screen bg-marketing-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-marketing-teal/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-marketing-text mb-6">
                DevHive
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-marketing-teal mb-4">
                Onboard developers in days, not weeks
              </p>
              <p className="text-lg text-marketing-text-muted mb-6 max-w-2xl">
                DevHive gives your team live, organized docs, structured onboarding flows, and insights so new engineers ship their first commit faster.
              </p>
              <p className="text-sm text-marketing-text-muted/60 mb-8">
                The live demo uses sample data shared by all visitors
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleTryDemo}
                  className="min-w-[200px] bg-marketing-teal hover:bg-marketing-teal-dark text-white font-semibold transition-all hover:scale-105"
                >
                  Try Live Demo
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="min-w-[200px] bg-transparent border-2 border-marketing-teal text-marketing-teal hover:bg-marketing-teal hover:text-white font-semibold transition-all"
                >
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Hero Visual - DevHive UI Composite */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-marketing-teal/20 blur-3xl rounded-full" />
                <div className="relative space-y-4">
                  {/* Mock Checklist Card */}
                  <Card className="p-6 bg-marketing-card border-marketing-teal/20 transform hover:scale-105 transition-transform">
                    <div className="flex items-start gap-3 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-marketing-text mb-1">Backend Dev Onboarding</h3>
                        <p className="text-sm text-marketing-text-muted">8 of 12 tasks completed</p>
                      </div>
                    </div>
                    <div className="w-full bg-marketing-bg rounded-full h-2">
                      <div className="bg-marketing-teal h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </Card>

                  {/* Mock Doc Card */}
                  <Card className="p-6 bg-marketing-card border-marketing-teal/20 transform hover:scale-105 transition-transform">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-marketing-text mb-2">Architecture Overview</h3>
                        <p className="text-sm text-marketing-text-muted">Microservices, API Gateway, Event Bus...</p>
                      </div>
                    </div>
                  </Card>

                  {/* Mock Insights Card */}
                  <Card className="p-6 bg-marketing-card border-marketing-teal/20 transform hover:scale-105 transition-transform">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-marketing-text mb-2">Avg. Time to Completion</h3>
                        <p className="text-3xl font-bold text-marketing-teal">3.2 weeks</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem-Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-marketing-text mb-4">
            The cost of bad developer onboarding
          </h2>
          <p className="text-lg text-marketing-text-muted max-w-3xl mx-auto">
            Scattered docs, tribal knowledge, and unclear expectations slow down new hires and drain senior engineers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before DevHive */}
          <Card className="p-8 bg-marketing-card border-destructive/30">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-destructive mb-2">Before DevHive</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-marketing-text">6–8 weeks ramp-up</p>
                  <p className="text-sm text-marketing-text-muted">Average time to first meaningful commit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-marketing-text">20–30% of senior time</p>
                  <p className="text-sm text-marketing-text-muted">Spent answering repetitive questions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-marketing-text">Scattered tribal knowledge</p>
                  <p className="text-sm text-marketing-text-muted">Docs in wikis, Slack, and people's heads</p>
                </div>
              </div>
            </div>
          </Card>

          {/* After DevHive */}
          <Card className="p-8 bg-marketing-card border-marketing-teal/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-marketing-teal/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-marketing-teal mb-2">After DevHive</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-marketing-text">3–4 weeks ramp-up</p>
                    <p className="text-sm text-marketing-text-muted">Structured onboarding with clear milestones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-marketing-text">5–10% of senior time</p>
                    <p className="text-sm text-marketing-text-muted">Self-serve docs reduce interruptions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-marketing-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-marketing-text">Centralized, searchable knowledge</p>
                    <p className="text-sm text-marketing-text-muted">One source of truth for all teams</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Solution & Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-marketing-text mb-4">
            How DevHive fixes developer onboarding
          </h2>
          <p className="text-lg text-marketing-text-muted max-w-3xl mx-auto">
            Everything you need to onboard faster, in one platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 bg-marketing-card border-marketing-teal/20 hover:border-marketing-teal/50 transition-all hover:scale-105"
              >
                <div className="w-12 h-12 rounded-lg bg-marketing-teal/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-marketing-teal" />
                </div>
                <h3 className="text-lg font-bold text-marketing-text mb-2">{feature.title}</h3>
                <p className="text-sm text-marketing-text-muted">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Target Personas Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-marketing-text mb-4">
            Built for modern engineering teams
          </h2>
          <p className="text-lg text-marketing-text-muted max-w-3xl mx-auto">
            DevHive solves onboarding pain for everyone on your team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <Card key={persona.title} className="p-8 bg-marketing-card border-marketing-teal/20">
                <div className="w-16 h-16 rounded-full bg-marketing-teal/10 flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-marketing-teal" />
                </div>
                <h3 className="text-xl font-bold text-marketing-text mb-4 text-center">{persona.title}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-1">Pain:</p>
                    <p className="text-sm text-marketing-text-muted">{persona.pain}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-marketing-teal mb-1">DevHive helps:</p>
                    <p className="text-sm text-marketing-text-muted">{persona.solution}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Final CTA / Waitlist Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Card className="p-12 bg-marketing-card border-marketing-teal/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-marketing-teal/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-marketing-teal/10 rounded-full blur-3xl" />
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-marketing-text mb-4">
              Ready to onboard faster?
            </h2>
            <p className="text-lg text-marketing-text-muted mb-8">
              See how DevHive can cut your developer onboarding time in half
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleTryDemo}
                className="min-w-[200px] bg-marketing-teal hover:bg-marketing-teal-dark text-white font-semibold transition-all hover:scale-105"
              >
                Try Live Demo
              </Button>
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-marketing-text mb-4">Or join the waitlist</h3>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  className="bg-marketing-bg border-marketing-teal/30 text-marketing-text placeholder:text-marketing-text-muted"
                />
                <Select value={waitlistRole} onValueChange={setWaitlistRole}>
                  <SelectTrigger className="bg-marketing-bg border-marketing-teal/30 text-marketing-text">
                    <SelectValue placeholder="Select your role (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng_manager">Engineering Manager</SelectItem>
                    <SelectItem value="tech_lead">Tech Lead</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-marketing-teal hover:bg-marketing-teal-dark text-white font-semibold"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
