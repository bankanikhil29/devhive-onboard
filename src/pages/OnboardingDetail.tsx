import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Clock, FileText } from 'lucide-react';

export default function OnboardingDetail() {
  const { id } = useParams();
  const { currentUser, assignments, assignmentStatuses, templateItems, templates, projects, users, documents, updateAssignmentStatus } = useApp();

  if (!currentUser) return null;

  const assignment = assignments.find(a => a.id === id);
  if (!assignment) return <Layout><div className="p-8">Assignment not found</div></Layout>;

  const template = templates.find(t => t.id === assignment.checklistTemplateId);
  const project = projects.find(p => p.id === assignment.projectId);
  const assignee = users.find(u => u.id === assignment.assignedToUserId);
  const items = templateItems
    .filter(i => i.checklistTemplateId === assignment.checklistTemplateId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  
  const itemStatuses = assignmentStatuses.filter(s => s.onboardingAssignmentId === assignment.id);

  const getItemStatus = (itemId: string) => {
    return itemStatuses.find(s => s.checklistItemTemplateId === itemId);
  };

  const progress = items.length === 0 ? 0 : Math.round(
    (itemStatuses.filter(s => s.status === 'completed').length / items.length) * 100
  );

  const handleToggle = (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    updateAssignmentStatus(assignment.id, itemId, newStatus);
  };

  const canEdit = currentUser.role === 'member' && assignment.assignedToUserId === currentUser.id;

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/onboarding" className="hover:text-foreground">Onboarding</Link>
            <span>/</span>
            <span>{assignee?.name || 'Assignment'}</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{template?.name}</h1>
              <p className="text-muted-foreground mb-2">{template?.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Project: {project?.name}</span>
                {currentUser.role === 'admin' && <span>Assignee: {assignee?.name}</span>}
              </div>
            </div>
            <Badge variant={
              assignment.status === 'completed' ? 'default' : 
              assignment.status === 'in_progress' ? 'secondary' : 
              'outline'
            } className="text-sm">
              {assignment.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {itemStatuses.filter(s => s.status === 'completed').length} of {items.length} tasks completed ({progress}%)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Tasks</h2>
          {items.map((item, index) => {
            const status = getItemStatus(item.id);
            const linkedDoc = item.linkedDocumentId ? documents.find(d => d.id === item.linkedDocumentId) : null;

            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      {canEdit ? (
                        <Checkbox
                          checked={status?.status === 'completed'}
                          onCheckedChange={() => handleToggle(item.id, status?.status || 'not_started')}
                        />
                      ) : (
                        <Checkbox checked={status?.status === 'completed'} disabled />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className={status?.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                          {index + 1}. {item.title}
                        </CardTitle>
                        <Badge variant="outline" className="ml-auto">
                          {status?.status?.replace('_', ' ') || 'not started'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3">
                        {item.estimatedMinutes && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {item.estimatedMinutes} min
                          </div>
                        )}
                        {linkedDoc && (
                          <Link to={`/documents/${linkedDoc.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              View Documentation
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
