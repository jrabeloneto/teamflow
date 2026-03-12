import { Member } from './member.model';
import { Team } from './team.model';

export interface Dashboard {
  totalTeams: number;
  activeTeams: number;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  onLeaveMembers: number;
  recentTeams: Team[];
  recentMembers: Member[];
}
