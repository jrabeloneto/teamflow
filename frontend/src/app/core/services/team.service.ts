import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, TeamRequest, PageResponse } from '../models/team.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly url = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10, search?: string, status?: string): Observable<PageResponse<Team>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'name');
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Team>>(this.url, { params });
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`);
  }

  create(request: TeamRequest): Observable<Team> {
    return this.http.post<Team>(this.url, request);
  }

  update(id: number, request: TeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
