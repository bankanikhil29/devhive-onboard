import React, { createContext, useContext, useState, ReactNode } from 'react';
import type {
  User,
  Workspace,
  Project,
  Document,
  OnboardingChecklistTemplate,
  OnboardingChecklistItemTemplate,
  OnboardingAssignment,
  OnboardingAssignmentItemStatus,
} from '@/types';

interface AppContextType {
  currentUser: User | null;
  workspaces: Workspace[];
  projects: Project[];
  documents: Document[];
  templates: OnboardingChecklistTemplate[];
  templateItems: OnboardingChecklistItemTemplate[];
  assignments: OnboardingAssignment[];
  assignmentStatuses: OnboardingAssignmentItemStatus[];
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'admin' | 'member') => Promise<void>;
  logout: () => void;
  createWorkspace: (data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createDocument: (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  createTemplate: (data: Omit<OnboardingChecklistTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  createTemplateItem: (data: Omit<OnboardingChecklistItemTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplateItem: (id: string, data: Partial<OnboardingChecklistItemTemplate>) => void;
  deleteTemplateItem: (id: string) => void;
  createAssignment: (data: Omit<OnboardingAssignment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedByUserId'>) => void;
  updateAssignmentStatus: (assignmentId: string, itemId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<OnboardingChecklistTemplate[]>([]);
  const [templateItems, setTemplateItems] = useState<OnboardingChecklistItemTemplate[]>([]);
  const [assignments, setAssignments] = useState<OnboardingAssignment[]>([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState<OnboardingAssignmentItemStatus[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    setCurrentUser(user);
  };

  const signup = async (name: string, email: string, password: string, role: 'admin' | 'member') => {
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    let workspaceId = '';
    if (role === 'admin') {
      const workspace: Workspace = {
        id: generateId(),
        name: `${name}'s Workspace`,
        description: 'My workspace',
        createdAt: now(),
        updatedAt: now(),
      };
      setWorkspaces(prev => [...prev, workspace]);
      workspaceId = workspace.id;
    } else {
      workspaceId = workspaces[0]?.id || '';
    }

    const user: User = {
      id: generateId(),
      workspaceId,
      name,
      email,
      role,
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const createWorkspace = (data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
    const workspace: Workspace = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    setWorkspaces(prev => [...prev, workspace]);
  };

  const createProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project: Project = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    setProjects(prev => [...prev, project]);
  };

  const createDocument = (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const doc: Document = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    setDocuments(prev => [...prev, doc]);
  };

  const updateDocument = (id: string, data: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...data, updatedAt: now() } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const createTemplate = (data: Omit<OnboardingChecklistTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const template: OnboardingChecklistTemplate = {
      ...data,
      id: data.id || generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    setTemplates(prev => [...prev, template]);
  };

  const createTemplateItem = (data: Omit<OnboardingChecklistItemTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: OnboardingChecklistItemTemplate = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    setTemplateItems(prev => [...prev, item]);
  };

  const updateTemplateItem = (id: string, data: Partial<OnboardingChecklistItemTemplate>) => {
    setTemplateItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...data, updatedAt: now() } : item))
    );
  };

  const deleteTemplateItem = (id: string) => {
    setTemplateItems(prev => prev.filter(item => item.id !== id));
  };

  const createAssignment = (data: Omit<OnboardingAssignment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedByUserId'>) => {
    const assignment: OnboardingAssignment = {
      ...data,
      id: generateId(),
      assignedByUserId: currentUser?.id || '',
      status: 'not_started',
      createdAt: now(),
      updatedAt: now(),
    };
    setAssignments(prev => [...prev, assignment]);

    const template = templates.find(t => t.id === data.checklistTemplateId);
    if (template) {
      const items = templateItems.filter(i => i.checklistTemplateId === template.id);
      const statuses: OnboardingAssignmentItemStatus[] = items.map(item => ({
        id: generateId(),
        onboardingAssignmentId: assignment.id,
        checklistItemTemplateId: item.id,
        status: 'not_started',
        createdAt: now(),
        updatedAt: now(),
      }));
      setAssignmentStatuses(prev => [...prev, ...statuses]);
    }
  };

  const updateAssignmentStatus = (
    assignmentId: string,
    itemId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    setAssignmentStatuses(prev =>
      prev.map(s =>
        s.onboardingAssignmentId === assignmentId && s.checklistItemTemplateId === itemId
          ? { ...s, status, completedAt: status === 'completed' ? now() : undefined, updatedAt: now() }
          : s
      )
    );

    const allStatuses = assignmentStatuses.filter(s => s.onboardingAssignmentId === assignmentId);
    const allCompleted = allStatuses.every(s => {
      if (s.checklistItemTemplateId === itemId) return status === 'completed';
      return s.status === 'completed';
    });

    if (allCompleted) {
      setAssignments(prev =>
        prev.map(a =>
          a.id === assignmentId
            ? { ...a, status: 'completed', completedAt: now(), updatedAt: now() }
            : a
        )
      );
    } else {
      const anyInProgress = allStatuses.some(s => {
        if (s.checklistItemTemplateId === itemId) return status === 'in_progress';
        return s.status === 'in_progress';
      });
      if (anyInProgress) {
        setAssignments(prev =>
          prev.map(a =>
            a.id === assignmentId && a.status === 'not_started'
              ? { ...a, status: 'in_progress', startedAt: now(), updatedAt: now() }
              : a
          )
        );
      }
    }
  };

  const createUser = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const user: User = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };
    setUsers(prev => [...prev, user]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        workspaces,
        projects,
        documents,
        templates,
        templateItems,
        assignments,
        assignmentStatuses,
        users,
        login,
        signup,
        logout,
        createWorkspace,
        createProject,
        createDocument,
        updateDocument,
        deleteDocument,
        createTemplate,
        createTemplateItem,
        updateTemplateItem,
        deleteTemplateItem,
        createAssignment,
        updateAssignmentStatus,
        createUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
