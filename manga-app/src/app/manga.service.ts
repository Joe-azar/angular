import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Manga } from './models/manga'; 

@Injectable({
  providedIn: 'root'
})
export class MangaService {
  private apiUrl = 'http://127.0.0.1:8000'; // API URL

  constructor(private http: HttpClient) {}

  getMangas(): Observable<Manga[]> {
    return this.http.get<Manga[]>(`${this.apiUrl}/mangas`);
  }

  // Favorites handling
  addToFavorites(manga: any): void {
    let favorites = this.getFavorites();
    if (!favorites.some(fav => fav.id === manga.id)) {
      favorites.push(manga);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }

  removeFromFavorites(mangaId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(fav => fav.id !== mangaId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getFavorites(): any[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }
}
