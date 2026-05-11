import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Dashboard } from '../models/dashboard.model';
import { mockStore } from './mock-data.store';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getDashboard(): Observable<Dashboard> {
    const teams = mockStore.getTeams();
    const members = mockStore.getMembers();
    const dash: Dashboard = {
      totalTeams: teams.length,
      activeTeams: teams.filter(t => t.status === 'ACTIVE').length,
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'ACTIVE').length,
      inactiveMembers: members.filter(m => m.status === 'INACTIVE').length,
      onLeaveMembers: members.filter(m => m.status === 'ON_LEAVE').length,
      recentTeams: [...teams].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      recentMembers: [...members].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    };
    return of(dash).pipe(delay(200));
  }
}
