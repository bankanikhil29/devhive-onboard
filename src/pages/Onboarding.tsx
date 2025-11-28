import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckSquare } from 'lucide-react';

export default function Onboarding() {
  const { currentUser, assignments, assignmentStatuses, projects, users } = useApp();

  if (!currentUser) return null;

  const relevantAssignments = currentUser.role === 'member'
    ? assignments.filter(a => a.assignedToUserId === currentUser.id)
    : assignments.filter(a => a.workspaceId === currentUser.workspaceId);

  const getAssignmentProgress = (assignmentId: string) => {
    const statuses = assignmentStatuses.filter(s => s.onboardingAssignmentId === assignmentId);
    if (statuses.length === 0) return 0;
    const completed = statuses.filter(s => s.status === 'completed').length;
    return Math.round((completed / statuses.length) * 100);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {currentUser.role === 'admin' ? 'Team Onboarding' : 'My Onboarding'}
          </h1>
          <p className="text-muted-foreground">
            {currentUser.role === 'admin' 
              ? 'Track and manage team member onboarding progress'
              : 'Complete your onboarding tasks and explore documentation'}
          </p>
        </div>

        {relevantAssignments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No onboarding assignments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {relevantAssignments.map(assignment => {
              const progress = getAssignmentProgress(assignment.id);
              const assignee = users.find(u => u.id === assignment.assignedToUserId);
              const project = projects.find(p => p.id === assignment.projectId);
              
              return (
                <Link key={assignment.id} to={`/onboarding/${assignment.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>
                            {currentUser.role === 'admin' && assignee ? assignee.name : project?.name || 'Onboarding'}
                          </CardTitle>
                          <CardDescription>
                            {currentUser.role === 'admin' ? project?.name : 'Onboarding checklist'}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          assignment.status === 'completed' ? 'default' : 
                          assignment.status === 'in_progress' ? 'secondary' : 
                          'outline'
                        }>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">{progress}% complete</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
