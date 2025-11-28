import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, CheckSquare, ExternalLink, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RepoConnectionPanel } from '@/components/RepoConnectionPanel';
import { CodeReferenceTab } from '@/components/CodeReferenceTab';

export default function ProjectDetail() {
  const { id } = useParams();
  const { currentUser, projects, documents, createDocument, templates } = useApp();
  const { toast } = useToast();
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  if (!currentUser) return null;

  const project = projects.find(p => p.id === id);
  if (!project) return <Layout><div className="p-8">Project not found</div></Layout>;

  const projectDocs = documents.filter(d => d.projectId === project.id);
  const projectTemplates = templates.filter(t => t.projectId === project.id);

  const handleDocSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;

    if (!title || title.length < 2 || title.length > 200) {
      toast({ title: 'Error', description: 'Title must be between 2 and 200 characters', variant: 'destructive' });
      return;
    }

    if (summary.length > 300) {
      toast({ title: 'Error', description: 'Summary must be less than 300 characters', variant: 'destructive' });
      return;
    }

    if (!content || content.length < 10) {
      toast({ title: 'Error', description: 'Content must be at least 10 characters', variant: 'destructive' });
      return;
    }

    createDocument({
      workspaceId: currentUser.workspaceId,
      projectId: project.id,
      title,
      summary,
      content,
      createdByUserId: currentUser.id,
      updatedByUserId: currentUser.id,
      isPinned: false,
    });

    toast({ title: 'Success', description: 'Document created successfully' });
    setDocDialogOpen(false);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/projects" className="hover:text-foreground">Projects</Link>
            <span>/</span>
            <span>{project.name}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Repository
                </a>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="docs">
          <TabsList>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="code">
              <Code2 className="w-4 h-4 mr-2" />
              Code Reference
            </TabsTrigger>
          </TabsList>
          <TabsContent value="docs" className="space-y-4">
            <div className="flex justify-end">
              {currentUser.role === 'admin' && (
                <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Documentation</DialogTitle>
                      <DialogDescription>Add a new documentation page</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDocSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" name="title" placeholder="Getting Started" required maxLength={200} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Input id="summary" name="summary" placeholder="Quick overview of this document" maxLength={300} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder="# Getting Started&#10;&#10;Write your documentation here..."
                          className="min-h-[300px] font-mono"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Create Document</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {projectDocs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No documentation yet</p>
                  {currentUser.role === 'admin' && (
                    <Button onClick={() => setDocDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projectDocs.map(doc => (
                  <Link key={doc.id} to={`/documents/${doc.id}`}>
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>{doc.summary}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="onboarding" className="space-y-4">
            <div className="flex justify-end">
              {currentUser.role === 'admin' && (
                <Link to={`/templates/new?projectId=${project.id}`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                  </Button>
                </Link>
              )}
            </div>

            {projectTemplates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No onboarding templates yet</p>
                  {currentUser.role === 'admin' && (
                    <Link to={`/templates/new?projectId=${project.id}`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Template
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projectTemplates.map(template => (
                  <Link key={template.id} to={`/templates/${template.id}`}>
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <RepoConnectionPanel projectId={project.id} />
            <CodeReferenceTab projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
