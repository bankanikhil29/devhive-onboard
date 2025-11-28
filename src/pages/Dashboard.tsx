import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckSquare, Users, FolderGit2 } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, projects, documents, assignments, assignmentStatuses, users } = useApp();

  if (!currentUser) return null;

  const workspaceProjects = projects.filter(p => p.workspaceId === currentUser.workspaceId);
  const workspaceDocs = documents.filter(d => d.workspaceId === currentUser.workspaceId);
  const workspaceUsers = users.filter(u => u.workspaceId === currentUser.workspaceId);
  
  const myAssignments = currentUser.role === 'member'
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
          <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}</h1>
          <p className="text-muted-foreground">
            {currentUser.role === 'admin' ? 'Manage your team and track onboarding progress' : 'Track your onboarding progress and access documentation'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderGit2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workspaceProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workspaceDocs.length}</div>
            </CardContent>
          </Card>
          {currentUser.role === 'admin' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workspaceUsers.length}</div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUser.role === 'admin' ? 'Active Onboardings' : 'My Onboarding'}
              </CardTitle>
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myAssignments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentUser.role === 'admin' ? 'Team Onboarding Status' : 'My Onboarding Progress'}
            </CardTitle>
            <CardDescription>
              {currentUser.role === 'admin' 
                ? 'Track your team members\' onboarding progress'
                : 'Complete your onboarding tasks to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active onboarding assignments</p>
            ) : (
              <div className="space-y-4">
                {myAssignments.slice(0, 5).map(assignment => {
                  const progress = getAssignmentProgress(assignment.id);
                  const assignee = users.find(u => u.id === assignment.assignedToUserId);
                  const project = projects.find(p => p.id === assignment.projectId);
                  
                  return (
                    <div key={assignment.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {currentUser.role === 'admin' && assignee ? assignee.name : project?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentUser.role === 'admin' ? project?.name : 'Onboarding checklist'}
                          </p>
                        </div>
                        <Badge variant={assignment.status === 'completed' ? 'default' : assignment.status === 'in_progress' ? 'secondary' : 'outline'}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{progress}% complete</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
