export type TeamStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Team {
  id: number;
  name: string;
  description?: string;
  department?: string;
  status: TeamStatus;
  managerId?: number;
  managerName?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRequest {
  name: string;
  description?: string;
  department?: string;
  status?: TeamStatus;
  managerId?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
