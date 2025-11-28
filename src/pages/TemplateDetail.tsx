import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { AtRiskBadge } from '@/components/AtRiskBadge';

export default function TemplateDetail() {
  const { id } = useParams();
  const { currentUser, templates, templateItems, assignments, users, projects, getAtRiskStatus } = useApp();

  if (!currentUser) return null;

  const template = templates.find(t => t.id === id);
  if (!template) return <Layout><div className="p-8">Template not found</div></Layout>;

  const project = projects.find(p => p.id === template.projectId);
  const items = templateItems.filter(item => item.checklistTemplateId === template.id).sort((a, b) => a.orderIndex - b.orderIndex);
  const templateAssignments = assignments.filter(a => a.checklistTemplateId === template.id);

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/projects" className="hover:text-foreground">Projects</Link>
            <span>/</span>
            <Link to={`/projects/${project?.id}`} className="hover:text-foreground">{project?.name}</Link>
            <span>/</span>
            <span>{template.name}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Template Items</h2>
          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-start gap-3">
                      <CheckSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        {item.description && (
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        )}
                        {item.estimatedMinutes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Estimated time: {item.estimatedMinutes} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No items in this template</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Assignments ({templateAssignments.length})</h2>
          {templateAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assignments yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Admins can assign this template to developers in Settings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {templateAssignments.map(assignment => {
                const assignee = users.find(u => u.id === assignment.assignedToUserId);
                const atRiskStatus = getAtRiskStatus(assignment);

                return (
                  <Link key={assignment.id} to={`/onboarding/${assignment.id}`}>
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">
                                {assignee?.name || 'Unknown User'}
                              </CardTitle>
                              <AtRiskBadge status={atRiskStatus} />
                            </div>
                            <CardDescription>
                              <div className="space-y-1">
                                <div>Status: <StatusBadge status={assignment.status} /></div>
                                {assignment.dueAt && (
                                  <div className="text-xs">
                                    Due: {new Date(assignment.dueAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
