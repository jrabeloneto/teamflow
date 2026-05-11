import { Team } from '../models/team.model';
import { Member } from '../models/member.model';

// In-memory demo data for the portfolio mock (no backend).
// Persisted to localStorage so changes survive page reloads.

const TEAMS_KEY = 'teamflow_demo_teams';
const MEMBERS_KEY = 'teamflow_demo_members';

const SEED_TEAMS: Team[] = [
  { id: 1, name: 'Engenharia',     description: 'Squad de plataforma e produto', department: 'Tech',       status: 'ACTIVE', managerId: 1, managerName: 'Admin User', memberCount: 4, createdAt: '2026-01-12T10:00:00Z', updatedAt: '2026-04-22T15:30:00Z' },
  { id: 2, name: 'Produto',        description: 'Discovery, design e PM',       department: 'Tech',       status: 'ACTIVE', managerId: 2, managerName: 'Maria Lima',  memberCount: 3, createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-05-02T11:00:00Z' },
  { id: 3, name: 'Marketing',      description: 'Branding e growth',            department: 'Comercial',  status: 'ACTIVE', managerId: 3, managerName: 'Carlos Souza', memberCount: 2, createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-04-10T09:15:00Z' },
  { id: 4, name: 'Vendas',         description: 'Pipeline e key accounts',      department: 'Comercial',  status: 'ACTIVE', managerId: 4, managerName: 'Renata Alves', memberCount: 3, createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-05-01T14:00:00Z' },
  { id: 5, name: 'Operações',      description: 'Logística e suprimentos',      department: 'Operacões',  status: 'INACTIVE', memberCount: 1, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-25T16:00:00Z' },
];

const SEED_MEMBERS: Member[] = [
  { id: 1,  name: 'Admin User',     email: 'admin@teamflow.com',     phone: '+55 11 90000-0000', position: 'CTO',                department: 'Tech',      status: 'ACTIVE', joinDate: '2025-08-01', teamId: 1, teamName: 'Engenharia', avatarUrl: 'https://i.pravatar.cc/100?u=admin',   createdAt: '2025-08-01T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 2,  name: 'Maria Lima',     email: 'maria@teamflow.com',     phone: '+55 11 91111-1111', position: 'Head of Product',    department: 'Tech',      status: 'ACTIVE', joinDate: '2025-09-15', teamId: 2, teamName: 'Produto',    avatarUrl: 'https://i.pravatar.cc/100?u=maria',   createdAt: '2025-09-15T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 3,  name: 'Carlos Souza',   email: 'carlos@teamflow.com',    phone: '+55 11 92222-2222', position: 'Marketing Lead',     department: 'Comercial', status: 'ACTIVE', joinDate: '2025-10-01', teamId: 3, teamName: 'Marketing',  avatarUrl: 'https://i.pravatar.cc/100?u=carlos',  createdAt: '2025-10-01T10:00:00Z', updatedAt: '2026-04-22T10:00:00Z' },
  { id: 4,  name: 'Renata Alves',   email: 'renata@teamflow.com',    phone: '+55 11 93333-3333', position: 'Sales Manager',      department: 'Comercial', status: 'ACTIVE', joinDate: '2025-11-10', teamId: 4, teamName: 'Vendas',     avatarUrl: 'https://i.pravatar.cc/100?u=renata',  createdAt: '2025-11-10T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 5,  name: 'Pedro Martins',  email: 'pedro@teamflow.com',     phone: '+55 11 94444-4444', position: 'Senior Engineer',    department: 'Tech',      status: 'ACTIVE', joinDate: '2026-01-05', teamId: 1, teamName: 'Engenharia', avatarUrl: 'https://i.pravatar.cc/100?u=pedro',   createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 6,  name: 'Juliana Castro', email: 'juliana@teamflow.com',   phone: '+55 11 95555-5555', position: 'Designer',           department: 'Tech',      status: 'ACTIVE', joinDate: '2026-01-22', teamId: 2, teamName: 'Produto',    avatarUrl: 'https://i.pravatar.cc/100?u=juliana', createdAt: '2026-01-22T10:00:00Z', updatedAt: '2026-04-10T10:00:00Z' },
  { id: 7,  name: 'Lucas Rocha',    email: 'lucas@teamflow.com',     phone: '+55 11 96666-6666', position: 'Backend Engineer',   department: 'Tech',      status: 'ON_LEAVE', joinDate: '2026-02-01', teamId: 1, teamName: 'Engenharia', avatarUrl: 'https://i.pravatar.cc/100?u=lucas',   createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-04-15T10:00:00Z' },
  { id: 8,  name: 'Fernanda Dias',  email: 'fernanda@teamflow.com',  phone: '+55 11 97777-7777', position: 'Account Executive',  department: 'Comercial', status: 'ACTIVE', joinDate: '2026-02-15', teamId: 4, teamName: 'Vendas',     avatarUrl: 'https://i.pravatar.cc/100?u=fernanda', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 9,  name: 'Bruno Tavares',  email: 'bruno@teamflow.com',     phone: '+55 11 98888-8888', position: 'Growth Analyst',     department: 'Comercial', status: 'ACTIVE', joinDate: '2026-03-01', teamId: 3, teamName: 'Marketing',  avatarUrl: 'https://i.pravatar.cc/100?u=bruno',   createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 10, name: 'Sofia Mendes',   email: 'sofia@teamflow.com',     phone: '+55 11 99999-9999', position: 'Product Manager',    department: 'Tech',      status: 'ACTIVE', joinDate: '2026-03-20', teamId: 2, teamName: 'Produto',    avatarUrl: 'https://i.pravatar.cc/100?u=sofia',   createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
  { id: 11, name: 'Diego Cardoso',  email: 'diego@teamflow.com',     phone: '+55 11 90101-0101', position: 'Sales Rep',          department: 'Comercial', status: 'INACTIVE', joinDate: '2025-12-01', teamId: 4, teamName: 'Vendas',     avatarUrl: 'https://i.pravatar.cc/100?u=diego',   createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-03-15T10:00:00Z' },
  { id: 12, name: 'Camila Pires',   email: 'camila@teamflow.com',    phone: '+55 11 90202-0202', position: 'Operations Analyst', department: 'Operações', status: 'ACTIVE', joinDate: '2026-01-10', teamId: 5, teamName: 'Operações',  avatarUrl: 'https://i.pravatar.cc/100?u=camila',  createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z' },
];

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(key, JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}

function persist<T>(key: string, value: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

class MockStore {
  private teams: Team[] = load(TEAMS_KEY, SEED_TEAMS);
  private members: Member[] = load(MEMBERS_KEY, SEED_MEMBERS);
  private nextTeamId = Math.max(0, ...this.teams.map(t => t.id)) + 1;
  private nextMemberId = Math.max(0, ...this.members.map(m => m.id)) + 1;

  getTeams(): Team[] { return this.teams.slice(); }
  getMembers(): Member[] { return this.members.slice(); }

  findTeam(id: number): Team | undefined { return this.teams.find(t => t.id === id); }
  findMember(id: number): Member | undefined { return this.members.find(m => m.id === id); }

  addTeam(t: Omit<Team, 'id' | 'memberCount' | 'createdAt' | 'updatedAt'>): Team {
    const now = new Date().toISOString();
    const created: Team = { id: this.nextTeamId++, memberCount: 0, createdAt: now, updatedAt: now, ...t } as Team;
    this.teams.unshift(created);
    persist(TEAMS_KEY, this.teams);
    return created;
  }

  updateTeam(id: number, patch: Partial<Team>): Team | undefined {
    const idx = this.teams.findIndex(t => t.id === id);
    if (idx < 0) return undefined;
    this.teams[idx] = { ...this.teams[idx], ...patch, updatedAt: new Date().toISOString() };
    persist(TEAMS_KEY, this.teams);
    return this.teams[idx];
  }

  deleteTeam(id: number): boolean {
    const before = this.teams.length;
    this.teams = this.teams.filter(t => t.id !== id);
    if (this.teams.length === before) return false;
    persist(TEAMS_KEY, this.teams);
    return true;
  }

  addMember(m: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Member {
    const now = new Date().toISOString();
    const created: Member = { id: this.nextMemberId++, createdAt: now, updatedAt: now, ...m } as Member;
    this.members.unshift(created);
    this.recomputeTeamCounts();
    persist(MEMBERS_KEY, this.members);
    return created;
  }

  updateMember(id: number, patch: Partial<Member>): Member | undefined {
    const idx = this.members.findIndex(m => m.id === id);
    if (idx < 0) return undefined;
    this.members[idx] = { ...this.members[idx], ...patch, updatedAt: new Date().toISOString() };
    this.recomputeTeamCounts();
    persist(MEMBERS_KEY, this.members);
    return this.members[idx];
  }

  deleteMember(id: number): boolean {
    const before = this.members.length;
    this.members = this.members.filter(m => m.id !== id);
    if (this.members.length === before) return false;
    this.recomputeTeamCounts();
    persist(MEMBERS_KEY, this.members);
    return true;
  }

  private recomputeTeamCounts(): void {
    for (const team of this.teams) {
      team.memberCount = this.members.filter(m => m.teamId === team.id && m.status === 'ACTIVE').length;
    }
    persist(TEAMS_KEY, this.teams);
  }
}

export const mockStore = new MockStore();
