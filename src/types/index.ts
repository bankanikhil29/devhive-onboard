export type UserRole = 'admin' | 'member';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface User {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  summary: string;
  content: string;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface OnboardingChecklistTemplate {
  id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  description: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface OnboardingChecklistItemTemplate {
  id: string;
  checklistTemplateId: string;
  title: string;
  description: string;
  linkedDocumentId?: string;
  orderIndex: number;
  estimatedMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingAssignment {
  id: string;
  workspaceId: string;
  checklistTemplateId: string;
  projectId: string;
  assignedToUserId: string;
  assignedByUserId: string;
  status: OnboardingStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingAssignmentItemStatus {
  id: string;
  onboardingAssignmentId: string;
  checklistItemTemplateId: string;
  status: OnboardingStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
