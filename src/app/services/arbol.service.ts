import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArbolService {

  private http = inject(HttpClient);

  // ODOO LOCAL -> SOLO HTTP
  private apiUrl = 'http://localhost:8069/api/arbol/generar';

  generarArbol(data: { nickname: string; svg: string | null }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

}
