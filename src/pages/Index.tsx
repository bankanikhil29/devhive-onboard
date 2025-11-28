import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { CheckCircle2, FileText, Users, BarChart3, MessageSquare, Clock, Search, TrendingUp, GitBranch, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-developer-desk.jpg';

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

  const handleSignUp = () => {
    navigate('/auth');
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
      {/* Hero Section - Matching code-sync-onboard exactly */}
      <div className="relative overflow-hidden bg-gradient-to-b from-marketing-navy via-marketing-navy to-marketing-navy-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-marketing-blue/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Integration Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-marketing-pill-bg border border-marketing-teal/20">
                <GitBranch className="w-4 h-4 text-marketing-teal" />
                <span className="text-sm text-marketing-text">Integrated with GitHub & GitLab</span>
              </div>

              {/* Main Heading */}
              <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-marketing-text leading-tight">
                Cut Developer Onboarding Time by{' '}
                <span className="text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-marketing-blue via-marketing-teal to-marketing-teal bg-clip-text text-transparent">
                  50%
                </span>
              </h1>
              </div>

              {/* Sub-copy */}
              <div className="space-y-2">
                <p className="text-lg lg:text-xl text-marketing-text-muted">
                  Transform scattered documentation into a live knowledge hub.
                </p>
                <p className="text-lg lg:text-xl text-marketing-text-muted">
                  Stop wasting weeks ramping up new developers.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="min-w-[180px] bg-marketing-blue hover:bg-marketing-blue/90 text-white font-semibold text-base px-8 py-6 rounded-lg transition-all hover:scale-105 shadow-lg shadow-marketing-blue/25"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={handleTryDemo}
                  variant="outline"
                  className="min-w-[180px] bg-transparent border-2 border-marketing-text-muted/30 text-marketing-text hover:bg-marketing-text hover:text-marketing-navy hover:border-marketing-text font-semibold text-base px-8 py-6 rounded-lg transition-all"
                >
                  Try Demo
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-marketing-text-muted/20">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-marketing-text mb-1">50%</div>
                  <div className="text-sm text-marketing-text-muted">Faster onboarding</div>
                </div>
                <div className="border-l border-marketing-text-muted/20 pl-4">
                  <div className="text-3xl lg:text-4xl font-bold text-marketing-text mb-1">80%</div>
                  <div className="text-sm text-marketing-text-muted">Fewer interruptions</div>
                </div>
                <div className="border-l border-marketing-text-muted/20 pl-4">
                  <div className="text-3xl lg:text-4xl font-bold text-marketing-text mb-1">3x</div>
                  <div className="text-sm text-marketing-text-muted">ROI in first month</div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="hidden lg:block relative min-h-[500px] flex items-center">
              <div className="relative w-full">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-marketing-teal/20 blur-3xl rounded-3xl" />
                
                {/* Hero Image Container with extra padding for floating card */}
                <div className="relative rounded-2xl overflow-visible shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src={heroImage} 
                      alt="Developer workspace with multiple monitors" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating Card Overlay */}
                  <div className="absolute -bottom-4 -left-6 p-4 rounded-xl bg-marketing-navy-light/95 backdrop-blur-sm border border-marketing-teal/30 shadow-2xl shadow-marketing-teal/10 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-marketing-teal/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-marketing-teal">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                          <path d="M9 18c-4.51 2-5-2-7-2"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-marketing-text">Auto-synced docs</div>
                        <div className="text-xs text-marketing-text-muted">Always up-to-date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem-Impact Section */}
      <div className="bg-marketing-navy-light py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Solution & Features Section */}
      <div className="bg-marketing-navy py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Target Personas Section */}
      <div className="bg-marketing-navy-light py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Final CTA / Waitlist Section */}
      <div className="bg-marketing-navy py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="min-w-[200px] bg-marketing-blue hover:bg-marketing-blue/90 text-white font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  Try Demo
                </Button>
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  variant="outline"
                  className="min-w-[200px] bg-transparent border-2 border-marketing-text-muted/30 text-marketing-text hover:bg-marketing-text-muted/10 font-semibold transition-all"
                >
                  Sign Up
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
                    className="bg-marketing-navy-light border-marketing-teal/30 text-marketing-text placeholder:text-marketing-text-muted"
                  />
                  <Select value={waitlistRole} onValueChange={setWaitlistRole}>
                    <SelectTrigger className="bg-marketing-navy-light border-marketing-teal/30 text-marketing-text">
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
                    className="w-full bg-marketing-blue hover:bg-marketing-blue/90 text-white font-semibold shadow-lg shadow-marketing-blue/25"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}