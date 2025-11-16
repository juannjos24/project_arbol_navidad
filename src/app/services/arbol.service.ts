import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArbolResponse {
  status: string;
  record_id: number;
  github_info: any;
  github_total_commits: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArbolService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8069/api/arbol/generar';

  generarArbol(data: { nickname: string; svg: string | null }): Observable<ArbolResponse> {
    return this.http.post<ArbolResponse>(this.apiUrl, data);
  }
}
