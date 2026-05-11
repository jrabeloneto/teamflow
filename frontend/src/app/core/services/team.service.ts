import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Team, TeamRequest, PageResponse } from '../models/team.model';
import { mockStore } from './mock-data.store';

@Injectable({ providedIn: 'root' })
export class TeamService {
  getAll(page = 0, size = 10, search?: string, status?: string): Observable<PageResponse<Team>> {
    let all = mockStore.getTeams();
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(t => t.name.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q));
    }
    if (status) all = all.filter(t => t.status === status);
    all = [...all].sort((a, b) => a.name.localeCompare(b.name));
    const totalElements = all.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const content = all.slice(page * size, page * size + size);
    return of({ content, totalElements, totalPages, size, number: page }).pipe(delay(150));
  }

  getById(id: number): Observable<Team> {
    const team = mockStore.findTeam(id);
    return of(team!).pipe(delay(150));
  }

  create(request: TeamRequest): Observable<Team> {
    const created = mockStore.addTeam({
      name: request.name,
      description: request.description,
      department: request.department,
      status: request.status ?? 'ACTIVE',
      managerId: request.managerId,
    } as Omit<Team, 'id' | 'memberCount' | 'createdAt' | 'updatedAt'>);
    return of(created).pipe(delay(200));
  }

  update(id: number, request: TeamRequest): Observable<Team> {
    const updated = mockStore.updateTeam(id, request);
    return of(updated!).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    mockStore.deleteTeam(id);
    return of(void 0).pipe(delay(150));
  }
}
