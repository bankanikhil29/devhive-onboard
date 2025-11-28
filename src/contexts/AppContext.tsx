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
  Comment,
  CommentEntityType,
  WaitlistSubscriber,
} from '@/types';
import { DEMO_WORKSPACE_ID, DEMO_ADMIN_EMAIL, DEMO_DEV_EMAIL } from '@/types';

interface AppContextType {
  currentUser: User | null;
  workspaces: Workspace[];
  projects: Project[];
  documents: Document[];
  templates: OnboardingChecklistTemplate[];
  templateItems: OnboardingChecklistItemTemplate[];
  assignments: OnboardingAssignment[];
  assignmentStatuses: OnboardingAssignmentItemStatus[];
  comments: Comment[];
  users: User[];
  waitlistSubscribers: WaitlistSubscriber[];
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'admin' | 'member') => Promise<void>;
  logout: () => void;
  isDemoUser: () => boolean;
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
  createComment: (entityType: CommentEntityType, entityId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  getComments: (entityType: CommentEntityType, entityId: string) => Comment[];
  searchGlobal: (query: string) => { documents: Document[]; templates: OnboardingChecklistTemplate[]; assignments: OnboardingAssignment[] };
  getAssignmentProgress: (assignmentId: string) => number;
  getAtRiskStatus: (assignment: OnboardingAssignment) => 'overdue' | 'due-soon' | 'on-time' | null;
  getInsightsMetrics: (projectId?: string) => {
    avgCompletionDays: number;
    statusCounts: { not_started: number; in_progress: number; completed: number };
    assignmentsOverTime: { date: string; count: number }[];
  };
  submitWaitlist: (email: string, role?: string) => Promise<void>;
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [waitlistSubscribers, setWaitlistSubscribers] = useState<WaitlistSubscriber[]>([]);
  const [demoSeeded, setDemoSeeded] = useState(false);

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

  const isDemoUser = () => {
    if (!currentUser) return false;
    return currentUser.workspaceId === DEMO_WORKSPACE_ID;
  };

  const seedDemoData = () => {
    if (demoSeeded) return;

    // Create demo workspace
    const demoWorkspace: Workspace = {
      id: DEMO_WORKSPACE_ID,
      name: 'Acme Dev Co - Demo',
      description: 'Demo workspace showcasing DevHive features',
      createdAt: now(),
      updatedAt: now(),
    };

    // Create demo users
    const demoAdmin: User = {
      id: 'demo-admin-id',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Demo Admin',
      email: DEMO_ADMIN_EMAIL,
      role: 'admin',
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };

    const demoDev: User = {
      id: 'demo-dev-id',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Alex Developer',
      email: DEMO_DEV_EMAIL,
      role: 'member',
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };

    const demoDevSarah: User = {
      id: 'demo-dev-sarah',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Sarah Chen',
      email: 'sarah.chen@demo.devhive.com',
      role: 'member',
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };

    const demoDevMike: User = {
      id: 'demo-dev-mike',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Mike Rodriguez',
      email: 'mike.r@demo.devhive.com',
      role: 'member',
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };

    const demoTechLead: User = {
      id: 'demo-tech-lead',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Priya Sharma',
      email: 'priya.sharma@demo.devhive.com',
      role: 'admin',
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };

    // Create demo projects
    const backendProject: Project = {
      id: 'demo-project-backend',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Backend API (Java)',
      description: 'REST API service built with Spring Boot',
      createdAt: now(),
      updatedAt: now(),
    };

    const frontendProject: Project = {
      id: 'demo-project-frontend',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Web App (React)',
      description: 'Customer-facing web application',
      createdAt: now(),
      updatedAt: now(),
    };

    const dataProject: Project = {
      id: 'demo-project-data',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Data Pipeline',
      description: 'ETL and analytics infrastructure',
      createdAt: now(),
      updatedAt: now(),
    };

    // Create demo documents for backend project
    const backendDocs: Document[] = [
      {
        id: 'demo-doc-backend-1',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-backend',
        title: 'Architecture Overview',
        summary: 'High-level system design and component interactions',
        content: '# Architecture Overview\n\nOur backend follows a microservices architecture with three main services:\n\n## Core Services\n- **API Gateway**: Routes requests and handles authentication\n- **User Service**: Manages user accounts and profiles\n- **Order Service**: Processes orders and payments\n\n## Infrastructure\n- PostgreSQL for persistent data\n- Redis for caching\n- RabbitMQ for async messaging',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-backend-2',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-backend',
        title: 'Local Setup Guide',
        summary: 'Step-by-step instructions to run the backend locally',
        content: '# Local Setup Guide\n\n## Prerequisites\n- Java 17+\n- Docker Desktop\n- Maven 3.8+\n\n## Steps\n1. Clone the repository\n2. Run `docker-compose up -d` to start dependencies\n3. Run `mvn clean install` to build\n4. Run `mvn spring-boot:run` to start the API\n5. Access at http://localhost:8080',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-backend-3',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-backend',
        title: 'Coding Standards',
        summary: 'Team conventions for code style and best practices',
        content: '# Coding Standards\n\n## General Guidelines\n- Follow Google Java Style Guide\n- Write unit tests for all business logic\n- Use meaningful variable names\n\n## Code Review Checklist\n- All tests passing\n- No commented-out code\n- Proper error handling\n- Documentation for public APIs',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-backend-4',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-backend',
        title: 'Deploy Process',
        summary: 'How to deploy to staging and production',
        content: '# Deploy Process\n\n## Staging Deployment\n1. Merge PR to `develop` branch\n2. CI/CD automatically deploys to staging\n3. Run smoke tests\n\n## Production Deployment\n1. Create release branch from `develop`\n2. Tag with version number\n3. Manual approval required\n4. Monitor metrics post-deploy',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create demo documents for frontend project
    const frontendDocs: Document[] = [
      {
        id: 'demo-doc-frontend-1',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-frontend',
        title: 'Component Library',
        summary: 'Reusable UI components and design system',
        content: '# Component Library\n\n## Core Components\n- Button (primary, secondary, ghost)\n- Input (text, email, password)\n- Card (with header, content, footer)\n\n## Usage\nImport from `@/components/ui` and use consistent props across the app.',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-frontend-2',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-frontend',
        title: 'State Management',
        summary: 'How we handle application state',
        content: '# State Management\n\nWe use Context API for global state and React Query for server state.\n\n## Global State\n- User session\n- Theme preferences\n\n## Server State\n- API data caching\n- Optimistic updates',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-frontend-3',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-frontend',
        title: 'Testing Strategy',
        summary: 'Unit tests, integration tests, and E2E testing approach',
        content: '# Testing Strategy\n\n## Testing Pyramid\n- **Unit Tests**: Jest + React Testing Library\n- **Integration Tests**: Test component interactions\n- **E2E Tests**: Playwright for critical user flows\n\n## Best Practices\n- Write tests for all new features\n- Minimum 80% code coverage\n- Mock external API calls',
        createdByUserId: 'demo-tech-lead',
        updatedByUserId: 'demo-tech-lead',
        isPinned: true,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-frontend-4',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-frontend',
        title: 'Routing & Navigation',
        summary: 'How routes are structured and protected',
        content: '# Routing & Navigation\n\n## Route Structure\n- `/` - Home page\n- `/dashboard` - User dashboard (protected)\n- `/profile` - User profile (protected)\n\n## Protected Routes\nUse `<ProtectedRoute>` wrapper for authenticated pages.\n\n## Navigation\nUse React Router Link component for internal navigation.',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-frontend-5',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-frontend',
        title: 'Performance Optimization',
        summary: 'Code splitting, lazy loading, and performance tips',
        content: '# Performance Optimization\n\n## Key Techniques\n- Code splitting with React.lazy()\n- Image optimization with Next/Image\n- Memoization with useMemo and useCallback\n- Virtual scrolling for large lists\n\n## Monitoring\n- Lighthouse CI in pipeline\n- Core Web Vitals tracking',
        createdByUserId: 'demo-tech-lead',
        updatedByUserId: 'demo-tech-lead',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create demo documents for data project
    const dataDocs: Document[] = [
      {
        id: 'demo-doc-data-1',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-data',
        title: 'Pipeline Architecture',
        summary: 'ETL workflow and data processing stages',
        content: '# Pipeline Architecture\n\n## Data Flow\n1. Extract: Pull data from source systems\n2. Transform: Clean and enrich data\n3. Load: Store in data warehouse\n\n## Technologies\n- Apache Airflow for orchestration\n- Python for transformations\n- Snowflake for storage',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-data-2',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-data',
        title: 'Data Quality Standards',
        summary: 'Validation rules and data quality checks',
        content: '# Data Quality Standards\n\n## Validation Rules\n- Schema validation on ingestion\n- Null checks for required fields\n- Range validation for numeric fields\n- Format validation for dates\n\n## Quality Metrics\n- Completeness: % of non-null values\n- Consistency: Cross-table validations\n- Timeliness: Data freshness SLAs',
        createdByUserId: 'demo-tech-lead',
        updatedByUserId: 'demo-tech-lead',
        isPinned: true,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-data-3',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-data',
        title: 'Airflow DAG Development',
        summary: 'Best practices for creating and maintaining DAGs',
        content: '# Airflow DAG Development\n\n## DAG Structure\n- Use dynamic task generation when possible\n- Set proper retry policies\n- Configure SLAs for critical tasks\n\n## Testing DAGs\n- Unit test task logic\n- Validate DAG integrity\n- Test with sample data first',
        createdByUserId: 'demo-admin-id',
        updatedByUserId: 'demo-admin-id',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-doc-data-4',
        workspaceId: DEMO_WORKSPACE_ID,
        projectId: 'demo-project-data',
        title: 'Monitoring & Alerting',
        summary: 'How to monitor pipelines and respond to failures',
        content: '# Monitoring & Alerting\n\n## Key Metrics\n- Pipeline success rate\n- Data volume processed\n- Processing duration\n- Error rate by pipeline\n\n## Alert Channels\n- PagerDuty for critical failures\n- Slack for warnings\n- Email summaries daily',
        createdByUserId: 'demo-tech-lead',
        updatedByUserId: 'demo-tech-lead',
        isPinned: false,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create demo templates
    const backendTemplate: OnboardingChecklistTemplate = {
      id: 'demo-template-backend',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-backend',
      name: 'Backend Developer Onboarding',
      description: 'Complete this checklist to get up to speed on our backend systems',
      createdByUserId: 'demo-admin-id',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };

    const frontendTemplate: OnboardingChecklistTemplate = {
      id: 'demo-template-frontend',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-frontend',
      name: 'Frontend Developer Onboarding',
      description: 'Learn our frontend stack and conventions',
      createdByUserId: 'demo-admin-id',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };

    const dataTemplate: OnboardingChecklistTemplate = {
      id: 'demo-template-data',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-data',
      name: 'Data Engineer Onboarding',
      description: 'Get familiar with our data infrastructure',
      createdByUserId: 'demo-tech-lead',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };

    // Create template items for backend
    const backendTemplateItems: OnboardingChecklistItemTemplate[] = [
      {
        id: 'demo-item-backend-1',
        checklistTemplateId: 'demo-template-backend',
        title: 'Read Architecture Overview',
        description: 'Understand our microservices architecture',
        orderIndex: 1,
        estimatedMinutes: 30,
        linkedDocumentId: 'demo-doc-backend-1',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-backend-2',
        checklistTemplateId: 'demo-template-backend',
        title: 'Set up local environment',
        description: 'Get the backend running on your machine',
        orderIndex: 2,
        estimatedMinutes: 60,
        linkedDocumentId: 'demo-doc-backend-2',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-backend-3',
        checklistTemplateId: 'demo-template-backend',
        title: 'Review Coding Standards',
        description: 'Learn our code style and best practices',
        orderIndex: 3,
        estimatedMinutes: 20,
        linkedDocumentId: 'demo-doc-backend-3',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-backend-4',
        checklistTemplateId: 'demo-template-backend',
        title: 'Complete first bugfix',
        description: 'Pick a starter issue and submit a PR',
        orderIndex: 4,
        estimatedMinutes: 120,
        linkedDocumentId: null,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create template items for frontend
    const frontendTemplateItems: OnboardingChecklistItemTemplate[] = [
      {
        id: 'demo-item-frontend-1',
        checklistTemplateId: 'demo-template-frontend',
        title: 'Explore Component Library',
        description: 'Review our UI components and design system',
        orderIndex: 1,
        estimatedMinutes: 30,
        linkedDocumentId: 'demo-doc-frontend-1',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-frontend-2',
        checklistTemplateId: 'demo-template-frontend',
        title: 'Learn State Management',
        description: 'Understand Context API and React Query usage',
        orderIndex: 2,
        estimatedMinutes: 45,
        linkedDocumentId: 'demo-doc-frontend-2',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-frontend-3',
        checklistTemplateId: 'demo-template-frontend',
        title: 'Set up Testing Environment',
        description: 'Configure Jest and write your first test',
        orderIndex: 3,
        estimatedMinutes: 60,
        linkedDocumentId: 'demo-doc-frontend-3',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-frontend-4',
        checklistTemplateId: 'demo-template-frontend',
        title: 'Build a Feature Component',
        description: 'Create a new component following our patterns',
        orderIndex: 4,
        estimatedMinutes: 90,
        linkedDocumentId: null,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create template items for data pipeline
    const dataTemplateItems: OnboardingChecklistItemTemplate[] = [
      {
        id: 'demo-item-data-1',
        checklistTemplateId: 'demo-template-data',
        title: 'Understand Pipeline Architecture',
        description: 'Learn how our ETL workflows are structured',
        orderIndex: 1,
        estimatedMinutes: 40,
        linkedDocumentId: 'demo-doc-data-1',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-data-2',
        checklistTemplateId: 'demo-template-data',
        title: 'Review Data Quality Standards',
        description: 'Learn validation rules and quality metrics',
        orderIndex: 2,
        estimatedMinutes: 30,
        linkedDocumentId: 'demo-doc-data-2',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: 'demo-item-data-3',
        checklistTemplateId: 'demo-template-data',
        title: 'Create Your First DAG',
        description: 'Build a simple Airflow DAG with unit tests',
        orderIndex: 3,
        estimatedMinutes: 120,
        linkedDocumentId: 'demo-doc-data-3',
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    // Create demo assignments
    const completedAssignment: OnboardingAssignment = {
      id: 'demo-assignment-completed',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-data',
      checklistTemplateId: 'demo-template-backend',
      assignedToUserId: 'demo-dev-id',
      assignedByUserId: 'demo-admin-id',
      status: 'completed',
      dueAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const inProgressAssignment: OnboardingAssignment = {
      id: 'demo-assignment-inprogress',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-backend',
      checklistTemplateId: 'demo-template-backend',
      assignedToUserId: 'demo-dev-id',
      assignedByUserId: 'demo-admin-id',
      status: 'in_progress',
      dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: undefined,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const overdueAssignment: OnboardingAssignment = {
      id: 'demo-assignment-overdue',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-frontend',
      checklistTemplateId: 'demo-template-frontend',
      assignedToUserId: 'demo-dev-id',
      assignedByUserId: 'demo-admin-id',
      status: 'not_started',
      dueAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      startedAt: undefined,
      completedAt: undefined,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const sarahDataAssignment: OnboardingAssignment = {
      id: 'demo-assignment-sarah-data',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-data',
      checklistTemplateId: 'demo-template-data',
      assignedToUserId: 'demo-dev-sarah',
      assignedByUserId: 'demo-tech-lead',
      status: 'in_progress',
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: undefined,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now(),
    };

    const mikeFrontendAssignment: OnboardingAssignment = {
      id: 'demo-assignment-mike-frontend',
      workspaceId: DEMO_WORKSPACE_ID,
      projectId: 'demo-project-frontend',
      checklistTemplateId: 'demo-template-frontend',
      assignedToUserId: 'demo-dev-mike',
      assignedByUserId: 'demo-admin-id',
      status: 'not_started',
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      startedAt: undefined,
      completedAt: undefined,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Create assignment statuses
    const backendStatuses: OnboardingAssignmentItemStatus[] = backendTemplateItems.map((item, idx) => ({
      id: `demo-status-backend-${idx}`,
      onboardingAssignmentId: 'demo-assignment-inprogress',
      checklistItemTemplateId: item.id,
      status: idx < 2 ? 'completed' : 'not_started' as 'not_started' | 'in_progress' | 'completed',
      completedAt: idx < 2 ? new Date(Date.now() - (2 - idx) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: now(),
      updatedAt: now(),
    }));

    const frontendStatuses: OnboardingAssignmentItemStatus[] = frontendTemplateItems.map((item, idx) => ({
      id: `demo-status-frontend-${idx}`,
      onboardingAssignmentId: 'demo-assignment-overdue',
      checklistItemTemplateId: item.id,
      status: 'not_started',
      completedAt: undefined,
      createdAt: now(),
      updatedAt: now(),
    }));

    const sarahDataStatuses: OnboardingAssignmentItemStatus[] = dataTemplateItems.map((item, idx) => ({
      id: `demo-status-sarah-data-${idx}`,
      onboardingAssignmentId: 'demo-assignment-sarah-data',
      checklistItemTemplateId: item.id,
      status: idx === 0 ? 'completed' : 'in_progress' as 'not_started' | 'in_progress' | 'completed',
      completedAt: idx === 0 ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: now(),
      updatedAt: now(),
    }));

    const mikeFrontendStatuses: OnboardingAssignmentItemStatus[] = frontendTemplateItems.map((item) => ({
      id: `demo-status-mike-${item.id}`,
      onboardingAssignmentId: 'demo-assignment-mike-frontend',
      checklistItemTemplateId: item.id,
      status: 'not_started',
      completedAt: undefined,
      createdAt: now(),
      updatedAt: now(),
    }));

    // Create demo comments
    const demoComments: Comment[] = [
      {
        id: 'demo-comment-1',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-backend-2',
        authorUserId: 'demo-dev-id',
        content: 'Quick question: do we need Docker Enterprise or is Docker Desktop sufficient for local dev?',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-2',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-backend-2',
        authorUserId: 'demo-admin-id',
        content: 'Docker Desktop is fine! No need for Enterprise for local development.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-3',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'assignment',
        entityId: 'demo-assignment-inprogress',
        authorUserId: 'demo-admin-id',
        content: 'Great progress so far! Let me know when you are ready to pair on the bugfix task.',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-4',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'assignment',
        entityId: 'demo-assignment-overdue',
        authorUserId: 'demo-admin-id',
        content: 'Hey Alex, noticed this is past due. Any blockers I can help with?',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-5',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-frontend-3',
        authorUserId: 'demo-dev-sarah',
        content: 'Should we be using Vitest instead of Jest for new projects?',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-6',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-frontend-3',
        authorUserId: 'demo-tech-lead',
        content: 'Good question! We\'re standardizing on Vitest for new React projects. Jest is still used in the legacy codebase.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-7',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-data-2',
        authorUserId: 'demo-dev-sarah',
        content: 'Where can I find examples of quality check implementations?',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-8',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'assignment',
        entityId: 'demo-assignment-sarah-data',
        authorUserId: 'demo-tech-lead',
        content: 'Nice work on completing the first task! Feel free to reach out if you need help with the DAG implementation.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-9',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-backend-3',
        authorUserId: 'demo-dev-mike',
        content: 'Are we using Checkstyle or SpotBugs for static analysis?',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-comment-10',
        workspaceId: DEMO_WORKSPACE_ID,
        entityType: 'document',
        entityId: 'demo-doc-backend-3',
        authorUserId: 'demo-admin-id',
        content: 'Both! Checkstyle for style and SpotBugs for bug patterns. They\'re configured in the Maven POM.',
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Set all demo data
    setWorkspaces(prev => {
      const existing = prev.find(w => w.id === DEMO_WORKSPACE_ID);
      return existing ? prev : [...prev, demoWorkspace];
    });
    setUsers(prev => {
      const hasDemo = prev.some(u => u.email === DEMO_ADMIN_EMAIL);
      return hasDemo ? prev : [...prev, demoAdmin, demoDev, demoDevSarah, demoDevMike, demoTechLead];
    });
    setProjects(prev => {
      const hasDemo = prev.some(p => p.id === 'demo-project-backend');
      return hasDemo ? prev : [...prev, backendProject, frontendProject, dataProject];
    });
    setDocuments(prev => {
      const hasDemo = prev.some(d => d.id === 'demo-doc-backend-1');
      return hasDemo ? prev : [...prev, ...backendDocs, ...frontendDocs, ...dataDocs];
    });
    setTemplates(prev => {
      const hasDemo = prev.some(t => t.id === 'demo-template-backend');
      return hasDemo ? prev : [...prev, backendTemplate, frontendTemplate, dataTemplate];
    });
    setTemplateItems(prev => {
      const hasDemo = prev.some(i => i.id === 'demo-item-backend-1');
      return hasDemo ? prev : [...prev, ...backendTemplateItems, ...frontendTemplateItems, ...dataTemplateItems];
    });
    setAssignments(prev => {
      const hasDemo = prev.some(a => a.id === 'demo-assignment-completed');
      return hasDemo ? prev : [...prev, completedAssignment, inProgressAssignment, overdueAssignment, sarahDataAssignment, mikeFrontendAssignment];
    });
    setAssignmentStatuses(prev => {
      const hasDemo = prev.some(s => s.id === 'demo-status-backend-0');
      return hasDemo ? prev : [...prev, ...backendStatuses, ...frontendStatuses, ...sarahDataStatuses, ...mikeFrontendStatuses];
    });
    setComments(prev => {
      const hasDemo = prev.some(c => c.id === 'demo-comment-1');
      return hasDemo ? prev : [...prev, ...demoComments];
    });

    setDemoSeeded(true);
  };

  const loginAsDemo = async () => {
    seedDemoData();
    const demoUser = users.find(u => u.email === DEMO_ADMIN_EMAIL) || {
      id: 'demo-admin-id',
      workspaceId: DEMO_WORKSPACE_ID,
      name: 'Demo Admin',
      email: DEMO_ADMIN_EMAIL,
      role: 'admin' as const,
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
    };
    setCurrentUser(demoUser);
  };

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

  const searchGlobal = (query: string) => {
    if (!currentUser) return { documents: [], templates: [], assignments: [] };
    
    const q = query.toLowerCase().trim();
    if (!q) return { documents: [], templates: [], assignments: [] };

    const filteredDocuments = documents.filter(d =>
      d.workspaceId === currentUser.workspaceId &&
      (d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
    );

    const filteredTemplates = templates.filter(t =>
      t.workspaceId === currentUser.workspaceId &&
      (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );

    const filteredAssignments = assignments.filter(a =>
      a.workspaceId === currentUser.workspaceId &&
      (currentUser.role === 'admin' || a.assignedToUserId === currentUser.id)
    );

    return { documents: filteredDocuments, templates: filteredTemplates, assignments: filteredAssignments };
  };

  const getAssignmentProgress = (assignmentId: string) => {
    const statuses = assignmentStatuses.filter(s => s.onboardingAssignmentId === assignmentId);
    if (statuses.length === 0) return 0;
    const completed = statuses.filter(s => s.status === 'completed').length;
    return Math.round((completed / statuses.length) * 100);
  };

  const createComment = (entityType: CommentEntityType, entityId: string, content: string) => {
    if (!currentUser) return;
    
    const sanitized = content.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').slice(0, 1000);
    if (!sanitized) return;

    const comment: Comment = {
      id: generateId(),
      workspaceId: currentUser.workspaceId,
      entityType,
      entityId,
      authorUserId: currentUser.id,
      content: sanitized,
      createdAt: now(),
      updatedAt: now(),
    };
    setComments(prev => [...prev, comment]);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const getComments = (entityType: CommentEntityType, entityId: string) => {
    if (!currentUser) return [];
    return comments
      .filter(c => c.workspaceId === currentUser.workspaceId && c.entityType === entityType && c.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAtRiskStatus = (assignment: OnboardingAssignment): 'overdue' | 'due-soon' | 'on-time' | null => {
    if (!assignment.dueAt || assignment.status === 'completed') return null;
    
    const dueDate = new Date(assignment.dueAt);
    const nowDate = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'due-soon';
    return 'on-time';
  };

  const getInsightsMetrics = (projectId?: string) => {
    if (!currentUser) return { avgCompletionDays: 0, statusCounts: { not_started: 0, in_progress: 0, completed: 0 }, assignmentsOverTime: [] };
    
    let filtered = assignments.filter(a => a.workspaceId === currentUser.workspaceId);
    if (projectId) {
      filtered = filtered.filter(a => a.projectId === projectId);
    }

    const completed = filtered.filter(a => a.status === 'completed' && a.completedAt && a.createdAt);
    const totalDays = completed.reduce((sum, a) => {
      const start = new Date(a.startedAt || a.createdAt);
      const end = new Date(a.completedAt!);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const avgCompletionDays = completed.length > 0 ? Math.round(totalDays / completed.length) : 0;

    const statusCounts = {
      not_started: filtered.filter(a => a.status === 'not_started').length,
      in_progress: filtered.filter(a => a.status === 'in_progress').length,
      completed: filtered.filter(a => a.status === 'completed').length,
    };

    const weekCounts = new Map<string, number>();
    filtered.forEach(a => {
      const date = new Date(a.createdAt);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const key = weekStart.toISOString().split('T')[0];
      weekCounts.set(key, (weekCounts.get(key) || 0) + 1);
    });
    const assignmentsOverTime = Array.from(weekCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { avgCompletionDays, statusCounts, assignmentsOverTime };
  };

  const submitWaitlist = async (email: string, role?: string): Promise<void> => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    if (waitlistSubscribers.some((sub) => sub.email === email)) {
      throw new Error('Email already registered');
    }

    const newSubscriber: WaitlistSubscriber = {
      id: `waitlist-${Date.now()}`,
      email: email.trim().toLowerCase(),
      role: role || undefined,
      createdAt: new Date().toISOString(),
    };

    setWaitlistSubscribers([...waitlistSubscribers, newSubscriber]);
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
        comments,
        users,
        waitlistSubscribers,
        login,
        loginAsDemo,
        signup,
        logout,
        isDemoUser,
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
        createComment,
        deleteComment,
        getComments,
        searchGlobal,
        getAssignmentProgress,
        getAtRiskStatus,
        getInsightsMetrics,
        submitWaitlist,
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
