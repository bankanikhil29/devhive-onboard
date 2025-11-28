import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateItemDraft {
  tempId: string;
  title: string;
  description: string;
  linkedDocumentId?: string;
  estimatedMinutes?: number;
}

export default function TemplateNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, projects, documents, createTemplate, createTemplateItem } = useApp();
  const { toast } = useToast();
  const [items, setItems] = useState<TemplateItemDraft[]>([]);
  const [selectedProject, setSelectedProject] = useState(searchParams.get('projectId') || '');

  if (!currentUser || currentUser.role !== 'admin') return null;

  const workspaceProjects = projects.filter(p => p.workspaceId === currentUser.workspaceId);
  const projectDocs = selectedProject ? documents.filter(d => d.projectId === selectedProject) : [];

  const handleAddItem = () => {
    setItems([...items, {
      tempId: crypto.randomUUID(),
      title: '',
      description: '',
      linkedDocumentId: undefined,
      estimatedMinutes: undefined,
    }]);
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(items.filter(i => i.tempId !== tempId));
  };

  const handleItemChange = (tempId: string, field: keyof TemplateItemDraft, value: any) => {
    setItems(items.map(i => i.tempId === tempId ? { ...i, [field]: value } : i));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const projectId = formData.get('projectId') as string;

    if (!name || name.length < 2 || name.length > 100) {
      toast({ title: 'Error', description: 'Template name must be between 2 and 100 characters', variant: 'destructive' });
      return;
    }

    if (description.length > 500) {
      toast({ title: 'Error', description: 'Description must be less than 500 characters', variant: 'destructive' });
      return;
    }

    if (!projectId) {
      toast({ title: 'Error', description: 'Please select a project', variant: 'destructive' });
      return;
    }

    if (items.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one task', variant: 'destructive' });
      return;
    }

    for (const item of items) {
      if (!item.title || item.title.length < 2 || item.title.length > 200) {
        toast({ title: 'Error', description: 'All task titles must be between 2 and 200 characters', variant: 'destructive' });
        return;
      }
      if (item.description.length > 500) {
        toast({ title: 'Error', description: 'Task descriptions must be less than 500 characters', variant: 'destructive' });
        return;
      }
    }

    const templateId = crypto.randomUUID();
    createTemplate({
      id: templateId,
      workspaceId: currentUser.workspaceId,
      projectId,
      name,
      description,
      createdByUserId: currentUser.id,
      isActive: true,
    });

    items.forEach((item, index) => {
      createTemplateItem({
        checklistTemplateId: templateId,
        title: item.title,
        description: item.description,
        linkedDocumentId: item.linkedDocumentId || undefined,
        orderIndex: index,
        estimatedMinutes: item.estimatedMinutes,
      });
    });

    toast({ title: 'Success', description: 'Onboarding template created successfully' });
    navigate(`/projects/${projectId}`);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Onboarding Template</h1>
          <p className="text-muted-foreground">Define a reusable onboarding checklist</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input id="name" name="name" placeholder="Backend Developer Onboarding" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Onboarding checklist for new backend developers" maxLength={500} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectId">Project *</Label>
                <Select name="projectId" value={selectedProject} onValueChange={setSelectedProject} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaceProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button type="button" onClick={handleAddItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {items.map((item, index) => (
              <Card key={item.tempId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Task {index + 1}</CardTitle>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.tempId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleItemChange(item.tempId, 'title', e.target.value)}
                      placeholder="Set up development environment"
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(item.tempId, 'description', e.target.value)}
                      placeholder="Install necessary tools and configure your local environment"
                      maxLength={500}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Linked Document</Label>
                      <Select
                        value={item.linkedDocumentId || 'none'}
                        onValueChange={(value) => handleItemChange(item.tempId, 'linkedDocumentId', value === 'none' ? undefined : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {projectDocs.map(doc => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Time (minutes)</Label>
                      <Input
                        type="number"
                        value={item.estimatedMinutes || ''}
                        onChange={(e) => handleItemChange(item.tempId, 'estimatedMinutes', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="30"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {items.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No tasks added yet</p>
                  <Button type="button" onClick={handleAddItem} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={items.length === 0}>
            Create Template
          </Button>
        </form>
      </div>
    </Layout>
  );
}
