export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';

export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  status: MemberStatus;
  joinDate?: string;
  teamId?: number;
  teamName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRequest {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  status?: MemberStatus;
  joinDate?: string;
  teamId?: number;
}
