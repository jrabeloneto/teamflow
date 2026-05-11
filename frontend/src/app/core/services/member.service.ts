import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Member, MemberRequest } from '../models/member.model';
import { PageResponse } from '../models/team.model';
import { mockStore } from './mock-data.store';

@Injectable({ providedIn: 'root' })
export class MemberService {
  getAll(page = 0, size = 10, search?: string, status?: string): Observable<PageResponse<Member>> {
    let all = mockStore.getMembers();
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.position ?? '').toLowerCase().includes(q)
      );
    }
    if (status) all = all.filter(m => m.status === status);
    all = [...all].sort((a, b) => a.name.localeCompare(b.name));
    const totalElements = all.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const content = all.slice(page * size, page * size + size);
    return of({ content, totalElements, totalPages, size, number: page }).pipe(delay(150));
  }

  getById(id: number): Observable<Member> {
    return of(mockStore.findMember(id)!).pipe(delay(150));
  }

  getByTeam(teamId: number): Observable<Member[]> {
    return of(mockStore.getMembers().filter(m => m.teamId === teamId)).pipe(delay(150));
  }

  create(request: MemberRequest): Observable<Member> {
    const team = request.teamId ? mockStore.findTeam(request.teamId) : undefined;
    const created = mockStore.addMember({
      name: request.name,
      email: request.email,
      phone: request.phone,
      position: request.position,
      department: request.department,
      avatarUrl: request.avatarUrl,
      status: request.status ?? 'ACTIVE',
      joinDate: request.joinDate,
      teamId: request.teamId,
      teamName: team?.name,
    } as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
    return of(created).pipe(delay(200));
  }

  update(id: number, request: MemberRequest): Observable<Member> {
    const team = request.teamId ? mockStore.findTeam(request.teamId) : undefined;
    const updated = mockStore.updateMember(id, { ...request, teamName: team?.name });
    return of(updated!).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    mockStore.deleteMember(id);
    return of(void 0).pipe(delay(150));
  }
}
