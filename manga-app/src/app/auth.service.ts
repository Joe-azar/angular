// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  private apiUrl = 'https://api.manga-db.com'; // API URL

  constructor(private http: HttpClient) {}

  login(credentials: { email?: string; name?: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  addFavorite(mangaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites`, { mangaId });
  }

  removeFavorite(mangaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${mangaId}`);
  }

}
