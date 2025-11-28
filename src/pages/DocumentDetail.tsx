import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { CommentsSection } from '@/components/CommentsSection';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, documents, projects, updateDocument, deleteDocument } = useApp();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!currentUser) return null;

  const doc = documents.find(d => d.id === id);
  if (!doc) return <Layout><div className="p-8">Document not found</div></Layout>;

  const project = projects.find(p => p.id === doc.projectId);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    updateDocument(doc.id, {
      title,
      summary,
      content,
      updatedByUserId: currentUser.id,
    });

    toast({ title: 'Success', description: 'Document updated successfully' });
    setEditOpen(false);
  };

  const handleDelete = () => {
    deleteDocument(doc.id);
    toast({ title: 'Success', description: 'Document deleted successfully' });
    navigate(`/projects/${doc.projectId}`);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/projects" className="hover:text-foreground">Projects</Link>
            <span>/</span>
            <Link to={`/projects/${project?.id}`} className="hover:text-foreground">{project?.name}</Link>
            <span>/</span>
            <span>{doc.title}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
              {doc.summary && <p className="text-muted-foreground">{doc.summary}</p>}
            </div>
            {currentUser.role === 'admin' && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap bg-muted/50 rounded-lg p-6">{doc.content}</div>
        </div>

        <CommentsSection entityType="document" entityId={doc.id} />

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>Update the documentation content</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input id="edit-title" name="title" defaultValue={doc.title} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-summary">Summary</Label>
                <Input id="edit-summary" name="summary" defaultValue={doc.summary} maxLength={300} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={doc.content}
                  className="min-h-[300px] font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Update Document</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{doc.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
