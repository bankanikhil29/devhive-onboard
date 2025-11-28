import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { CheckSquare, Filter } from 'lucide-react';
import type { OnboardingStatus } from '@/types';

export default function Onboarding() {
  const { currentUser, assignments, getAssignmentProgress, projects, users, templates } = useApp();
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  if (!currentUser) return null;

  const relevantAssignments = currentUser.role === 'member'
    ? assignments.filter(a => a.assignedToUserId === currentUser.id)
    : assignments.filter(a => a.workspaceId === currentUser.workspaceId);

  // Apply filters
  let filtered = relevantAssignments;
  if (filterProject !== 'all') {
    filtered = filtered.filter(a => a.projectId === filterProject);
  }
  if (filterStatus !== 'all') {
    filtered = filtered.filter(a => a.status === filterStatus);
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'progress') {
      return getAssignmentProgress(b.id) - getAssignmentProgress(a.id);
    }
    return 0;
  });

  // Status summary for admin
  const statusCounts = currentUser.role === 'admin' ? {
    not_started: relevantAssignments.filter(a => a.status === 'not_started').length,
    in_progress: relevantAssignments.filter(a => a.status === 'in_progress').length,
    completed: relevantAssignments.filter(a => a.status === 'completed').length,
  } : null;

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {currentUser.role === 'admin' ? 'Onboarding Overview' : 'My Onboarding'}
          </h1>
          <p className="text-muted-foreground">
            {currentUser.role === 'admin' 
              ? 'Track and manage team member onboarding progress'
              : 'Complete your onboarding tasks and explore documentation'}
          </p>
        </div>

        {currentUser.role === 'admin' && statusCounts && (
          <div className="flex gap-3 flex-wrap">
            <Badge variant="outline" className="px-3 py-1.5">
              {statusCounts.not_started} not started
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              {statusCounts.in_progress} in progress
            </Badge>
            <Badge variant="default" className="px-3 py-1.5">
              {statusCounts.completed} completed
            </Badge>
          </div>
        )}

        {relevantAssignments.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No onboarding assignments yet"
            description={currentUser.role === 'admin' 
              ? "Create an onboarding checklist template and assign it to team members from the Settings page."
              : "Your admin hasn't assigned you any onboarding tasks yet. Check back soon!"}
          />
        ) : (
          <>
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <CardTitle className="text-base">Filters & Sorting</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project</label>
                    <Select value={filterProject} onValueChange={setFilterProject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {projects
                          .filter(p => p.workspaceId === currentUser.workspaceId)
                          .map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Assigned Date (Newest)</SelectItem>
                        <SelectItem value="progress">% Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No assignments match your filters
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr className="text-left text-sm text-muted-foreground">
                            <th className="p-4 font-medium">Developer</th>
                            <th className="p-4 font-medium">Project</th>
                            <th className="p-4 font-medium">Checklist</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Progress</th>
                            <th className="p-4 font-medium">Assigned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(assignment => {
                            const progress = getAssignmentProgress(assignment.id);
                            const assignee = users.find(u => u.id === assignment.assignedToUserId);
                            const project = projects.find(p => p.id === assignment.projectId);
                            const template = templates.find(t => t.id === assignment.checklistTemplateId);
                            
                            return (
                              <tr key={assignment.id} className="border-b last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => window.location.href = `/onboarding/${assignment.id}`}>
                                <td className="p-4">{assignee?.name || 'Unknown'}</td>
                                <td className="p-4">{project?.name || 'Unknown'}</td>
                                <td className="p-4">{template?.name || 'Onboarding'}</td>
                                <td className="p-4">
                                  <StatusBadge status={assignment.status} />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Progress value={progress} className="h-2 w-24" />
                                    <span className="text-sm text-muted-foreground">{progress}%</span>
                                  </div>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(assignment.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden grid gap-4">
                  {filtered.map(assignment => {
                    const progress = getAssignmentProgress(assignment.id);
                    const assignee = users.find(u => u.id === assignment.assignedToUserId);
                    const project = projects.find(p => p.id === assignment.projectId);
                    const template = templates.find(t => t.id === assignment.checklistTemplateId);
                    
                    return (
                      <Link key={assignment.id} to={`/onboarding/${assignment.id}`}>
                        <Card className="hover:border-primary transition-colors cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{assignee?.name || 'Unknown'}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {project?.name} • {template?.name}
                                </CardDescription>
                              </div>
                              <StatusBadge status={assignment.status} />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{progress}% complete</span>
                              <span className="text-muted-foreground">
                                {new Date(assignment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
