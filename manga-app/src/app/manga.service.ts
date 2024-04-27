import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Manga } from './models/manga'; 

@Injectable({
  providedIn: 'root'
})
export class MangaService {
  private apiUrl = 'https://api.manga-db.com'; // API URL

  constructor(private http: HttpClient) {}

  getMangas(): Observable<Manga[]> {
    return this.http.get<Manga[]>(`${this.apiUrl}/mangas`).pipe(
      catchError(error => {
        console.error('Error fetching mangas:', error);
        return throwError(() => new Error('Failed to fetch mangas'));
      })
    );
  }
  

  addToFavorites(manga: Manga): Observable<Manga> {
    const favorites = this.getFavorites();
    if (!favorites.find(fav => fav.id === manga.id)) {
      favorites.push(manga);
      this.updateFavorites(favorites);
    }
    return this.http.post<Manga>(`${this.apiUrl}/favorites`, manga);
  }

  removeFromFavorites(mangaId: number): Observable<any> {
    let favorites = this.getFavorites();
    favorites = favorites.filter(fav => fav.id !== mangaId);
    this.updateFavorites(favorites);
    return this.http.delete(`${this.apiUrl}/favorites/${mangaId}`);
  }

  getFavorites(): Manga[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }
  private updateFavorites(favorites: Manga[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
