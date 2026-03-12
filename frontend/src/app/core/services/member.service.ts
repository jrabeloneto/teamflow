import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, MemberRequest } from '../models/member.model';
import { PageResponse } from '../models/team.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly url = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10, search?: string, status?: string): Observable<PageResponse<Member>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'name');
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Member>>(this.url, { params });
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.url}/${id}`);
  }

  getByTeam(teamId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.url}/team/${teamId}`);
  }

  create(request: MemberRequest): Observable<Member> {
    return this.http.post<Member>(this.url, request);
  }

  update(id: number, request: MemberRequest): Observable<Member> {
    return this.http.put<Member>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
