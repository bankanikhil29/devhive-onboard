import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FolderGit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Projects() {
  const { currentUser, projects, createProject, documents } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  const workspaceProjects = projects.filter(p => p.workspaceId === currentUser.workspaceId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const repoUrl = formData.get('repoUrl') as string;

    if (!name || name.length < 2 || name.length > 100) {
      toast({ title: 'Error', description: 'Project name must be between 2 and 100 characters', variant: 'destructive' });
      return;
    }

    if (description.length > 500) {
      toast({ title: 'Error', description: 'Description must be less than 500 characters', variant: 'destructive' });
      return;
    }

    createProject({
      workspaceId: currentUser.workspaceId,
      name,
      description,
      repoUrl: repoUrl || undefined,
    });

    toast({ title: 'Success', description: 'Project created successfully' });
    setOpen(false);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your codebases and repositories</p>
          </div>
          {currentUser.role === 'admin' && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Add a new codebase to your workspace</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input id="name" name="name" placeholder="My Awesome Project" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Brief description of the project" maxLength={500} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl">Repository URL</Label>
                    <Input id="repoUrl" name="repoUrl" type="url" placeholder="https://github.com/..." />
                  </div>
                  <Button type="submit" className="w-full">Create Project</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {workspaceProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderGit2 className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              {currentUser.role === 'admin' && (
                <Button onClick={() => setOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaceProjects.map(project => {
              const projectDocs = documents.filter(d => d.projectId === project.id);
              return (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5" />
                        {project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{projectDocs.length} documents</p>
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
