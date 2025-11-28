import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Github, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RepoConnectionPanelProps {
  projectId: string;
}

export const RepoConnectionPanel = ({ projectId }: RepoConnectionPanelProps) => {
  const { getRepoConnection, connectRepo, generateCodeDocs, currentUser } = useApp();
  const { toast } = useToast();
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const connection = getRepoConnection(projectId);
  const isAdmin = currentUser?.role === 'admin';

  const handleConnect = async () => {
    if (!repoUrl || !branch || !token) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      await connectRepo(projectId, repoUrl, branch, token);
      toast({
        title: 'Repository connected',
        description: 'Successfully connected to GitHub repository',
      });
      setToken(''); // Clear token after successful connection
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect repository',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateCodeDocs(projectId);
      toast({
        title: 'Code documentation generated',
        description: 'Successfully generated code reference from repository',
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate code docs',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Code Repository</CardTitle>
          <CardDescription>Repository connection is managed by administrators</CardDescription>
        </CardHeader>
        {connection && (
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Github className="h-4 w-4" />
              <span className="text-sm font-medium">{connection.repoUrl}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Branch: {connection.defaultBranch}
            </div>
            {connection.lastSyncedAt && (
              <div className="text-sm text-muted-foreground mt-1">
                Last synced {formatDistanceToNow(new Date(connection.lastSyncedAt), { addSuffix: true })}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  }

  if (connection) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Code Repository</CardTitle>
              <CardDescription>Manage your GitHub repository connection</CardDescription>
            </div>
            <Badge variant={connection.status === 'connected' ? 'default' : 'destructive'}>
              {connection.status === 'connected' ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {connection.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <span className="text-sm font-medium">{connection.repoUrl}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Branch: {connection.defaultBranch}
          </div>
          {connection.lastSyncedAt && (
            <div className="text-sm text-muted-foreground">
              Last synced {formatDistanceToNow(new Date(connection.lastSyncedAt), { addSuffix: true })}
            </div>
          )}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? 'Generating...' : 'Generate Code Docs'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Repository</CardTitle>
        <CardDescription>Connect your GitHub repository to generate code documentation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Default Branch</Label>
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="token">Personal Access Token</Label>
          <Input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Token is only used once to validate access and not stored in browser
          </p>
        </div>
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Connecting...' : 'Connect Repository'}
        </Button>
      </CardContent>
    </Card>
  );
};