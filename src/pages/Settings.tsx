import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { currentUser, users, createUser, projects, createAssignment, templates } = useApp();
  const { toast } = useToast();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const workspaceUsers = users.filter(u => u.workspaceId === currentUser.workspaceId);

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'member';

    if (!name || name.length < 2 || name.length > 100) {
      toast({ title: 'Error', description: 'Name must be between 2 and 100 characters', variant: 'destructive' });
      return;
    }

    if (!email.includes('@') || email.length > 255) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    if (users.find(u => u.email === email)) {
      toast({ title: 'Error', description: 'User with this email already exists', variant: 'destructive' });
      return;
    }

    createUser({
      workspaceId: currentUser.workspaceId,
      name,
      email,
      role,
    });

    toast({ title: 'Success', description: 'User created successfully' });
    setUserDialogOpen(false);
  };

  const handleAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get('userId') as string;
    const templateId = formData.get('templateId') as string;

    if (!userId || !templateId) {
      toast({ title: 'Error', description: 'Please select both user and template', variant: 'destructive' });
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    createAssignment({
      workspaceId: currentUser.workspaceId,
      checklistTemplateId: templateId,
      projectId: template.projectId,
      assignedToUserId: userId,
    });

    toast({ title: 'Success', description: 'Onboarding assigned successfully' });
    setAssignDialogOpen(false);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your workspace and team</p>
        </div>

        <Tabs defaultValue="team">
          <TabsList>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>Create a new user account</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Name *</Label>
                      <Input id="user-name" name="name" required maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email *</Label>
                      <Input id="user-email" name="email" type="email" required maxLength={255} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Role *</Label>
                      <Select name="role" defaultValue="member" required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Add User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {workspaceUsers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No team members yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {workspaceUsers.map(user => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{user.name}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Onboarding
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Onboarding</DialogTitle>
                    <DialogDescription>Assign an onboarding checklist to a team member</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAssign} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assign-user">Team Member *</Label>
                      <Select name="userId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaceUsers
                            .filter(u => u.role === 'member')
                            .map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assign-template">Onboarding Template *</Label>
                      <Select name="templateId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates
                            .filter(t => t.workspaceId === currentUser.workspaceId && t.isActive)
                            .map(template => {
                              const proj = projects.find(p => p.id === template.projectId);
                              return (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name} ({proj?.name})
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Assign</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardDescription>Assignment functionality is available in Settings → Assignments</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
