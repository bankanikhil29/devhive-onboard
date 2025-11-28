import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Search as SearchIcon, FileText, CheckSquare, ClipboardList, Code2 } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchGlobalWithCode, projects, users, templates } = useApp();
  const [results, setResults] = useState({ documents: [], templates: [], assignments: [], codeModules: [] });

  useEffect(() => {
    if (query) {
      setResults(searchGlobalWithCode(query));
    }
  }, [query]);

  const hasResults = results.documents.length > 0 || results.templates.length > 0 || results.assignments.length > 0 || results.codeModules.length > 0;

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Showing results for "${query}"` : 'Enter a search query to find documents, checklists, and assignments'}
          </p>
        </div>

        {!query ? (
          <EmptyState
            icon={SearchIcon}
            title="No search query"
            description="Use the search bar above to find documents, onboarding checklists, and assignments across your workspace."
          />
        ) : !hasResults ? (
          <EmptyState
            icon={SearchIcon}
            title="No results found"
            description={`No documents, checklists, or assignments match "${query}". Try a different search term.`}
          />
        ) : (
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">
                Documents <Badge variant="secondary" className="ml-2">{results.documents.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="checklists">
                Checklists <Badge variant="secondary" className="ml-2">{results.templates.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="assignments">
                Assignments <Badge variant="secondary" className="ml-2">{results.assignments.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="code">
                Code <Badge variant="secondary" className="ml-2">{results.codeModules.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-3">
              {results.documents.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No documents found
                  </CardContent>
                </Card>
              ) : (
                results.documents.map(doc => {
                  const project = projects.find(p => p.id === doc.projectId);
                  return (
                    <Link key={doc.id} to={`/documents/${doc.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">DOC</Badge>
                              </div>
                              <CardTitle className="mt-2">{doc.title}</CardTitle>
                              <CardDescription className="mt-1">{doc.summary}</CardDescription>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Project: {project?.name || 'Unknown'}
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="checklists" className="space-y-3">
              {results.templates.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No checklists found
                  </CardContent>
                </Card>
              ) : (
                results.templates.map(template => {
                  const project = projects.find(p => p.id === template.projectId);
                  const itemCount = 0; // Could compute this if needed
                  return (
                    <Link key={template.id} to={`/projects/${template.projectId}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">CHECKLIST</Badge>
                              </div>
                              <CardTitle className="mt-2">{template.name}</CardTitle>
                              <CardDescription className="mt-1">{template.description}</CardDescription>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Project: {project?.name || 'Unknown'}
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-3">
              {results.assignments.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No assignments found
                  </CardContent>
                </Card>
              ) : (
                results.assignments.map(assignment => {
                  const template = templates.find(t => t.id === assignment.checklistTemplateId);
                  const project = projects.find(p => p.id === assignment.projectId);
                  const assignee = users.find(u => u.id === assignment.assignedToUserId);
                  return (
                    <Link key={assignment.id} to={`/onboarding/${assignment.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">ASSIGNMENT</Badge>
                              </div>
                              <CardTitle className="mt-2">{template?.name || 'Onboarding'}</CardTitle>
                              <CardDescription className="mt-1">
                                Assigned to {assignee?.name || 'Unknown'}
                              </CardDescription>
                            </div>
                            <StatusBadge status={assignment.status} />
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Project: {project?.name || 'Unknown'}
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-3">
              {results.codeModules.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No code references found
                  </CardContent>
                </Card>
              ) : (
                results.codeModules.map(module => {
                  const project = projects.find(p => p.id === module.projectId);
                  return (
                    <Link key={module.id} to={`/projects/${module.projectId}?tab=code`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">CODE</Badge>
                                <Badge variant="secondary" className="text-xs">{module.exportKind}</Badge>
                              </div>
                              <CardTitle className="mt-2">{module.exportName}</CardTitle>
                              <CardDescription className="mt-1">
                                {module.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 font-mono">
                            {module.filePath}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Project: {project?.name || 'Unknown'}
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
