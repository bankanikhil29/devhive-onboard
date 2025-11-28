import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileCode, Folder, FolderOpen, Braces, Box, FileType, Code } from 'lucide-react';
import type { CodeModule } from '@/types';

interface CodeReferenceTabProps {
  projectId: string;
}

interface FileTree {
  [key: string]: {
    files: CodeModule[];
    subdirs: FileTree;
  };
}

export const CodeReferenceTab = ({ projectId }: CodeReferenceTabProps) => {
  const { codeModules, getRepoConnection } = useApp();
  const [selectedModule, setSelectedModule] = useState<CodeModule | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src']));

  const connection = getRepoConnection(projectId);
  const projectModules = codeModules.filter(m => m.projectId === projectId);

  const fileTree = useMemo(() => {
    const tree: FileTree = {};
    
    projectModules.forEach(module => {
      const parts = module.filePath.split('/');
      let current = tree;
      
      // Build directory structure
      for (let i = 0; i < parts.length - 1; i++) {
        const dir = parts[i];
        if (!current[dir]) {
          current[dir] = { files: [], subdirs: {} };
        }
        current = current[dir].subdirs;
      }
      
      // Add file to final directory
      const fileName = parts[parts.length - 1];
      const dir = parts[parts.length - 2] || 'root';
      if (!current[dir]) {
        current[dir] = { files: [], subdirs: {} };
      }
      current[dir].files.push(module);
    });
    
    return tree;
  }, [projectModules]);

  const toggleDir = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTree = (tree: FileTree, basePath: string = '', level: number = 0) => {
    return Object.entries(tree).map(([name, { files, subdirs }]) => {
      const path = basePath ? `${basePath}/${name}` : name;
      const isExpanded = expandedDirs.has(path);
      const hasSubdirs = Object.keys(subdirs).length > 0;

      return (
        <div key={path}>
          <div
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-accent rounded-md cursor-pointer text-sm"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => toggleDir(path)}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium">{name}</span>
            {files.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {files.length}
              </Badge>
            )}
          </div>
          
          {isExpanded && (
            <>
              {files.map(module => (
                <div
                  key={module.id}
                  className={`flex items-center gap-2 py-1.5 px-2 hover:bg-accent rounded-md cursor-pointer text-sm ${
                    selectedModule?.id === module.id ? 'bg-accent' : ''
                  }`}
                  style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                  onClick={() => setSelectedModule(module)}
                >
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{module.exportName}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {module.exportKind}
                  </Badge>
                </div>
              ))}
              {hasSubdirs && renderTree(subdirs, path, level + 1)}
            </>
          )}
        </div>
      );
    });
  };

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'function':
        return <Braces className="h-4 w-4" />;
      case 'class':
        return <Box className="h-4 w-4" />;
      case 'interface':
      case 'type':
        return <FileType className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  if (!connection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Repository Connected</CardTitle>
          <CardDescription>
            Connect a GitHub repository to automatically generate code documentation
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (projectModules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Code Documentation</CardTitle>
          <CardDescription>
            Click "Generate Code Docs" to parse your repository and create code references
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-4">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="text-base">File Tree</CardTitle>
            <CardDescription className="text-xs">
              {projectModules.length} exports found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[480px]">
              {renderTree(fileTree)}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-8">
        {selectedModule ? (
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center gap-2">
                {getKindIcon(selectedModule.exportKind)}
                <CardTitle className="text-base">{selectedModule.exportName}</CardTitle>
                <Badge variant="secondary">{selectedModule.exportKind}</Badge>
              </div>
              <CardDescription className="text-xs font-mono">
                {selectedModule.filePath}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedModule.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex">
                    <dt className="font-medium w-24">Type:</dt>
                    <dd className="text-muted-foreground">{selectedModule.exportKind}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium w-24">File:</dt>
                    <dd className="text-muted-foreground font-mono text-xs">
                      {selectedModule.filePath}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium w-24">Last synced:</dt>
                    <dd className="text-muted-foreground">
                      {new Date(selectedModule.lastSyncedAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-[600px] flex items-center justify-center">
            <CardContent>
              <p className="text-muted-foreground text-center">
                Select a module from the file tree to view details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};