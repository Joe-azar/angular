import { Component, OnInit } from '@angular/core';
import { MangaService } from '../manga.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Manga } from '../models/manga';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule, 
    ReactiveFormsModule
  ]
})
export class HomeComponent implements OnInit {
  mangas : Manga[] = [];
  filteredMangas : Manga[] = [];
  searchForm: FormGroup;
  categories: string[] = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'];
  favorites: Set<number> = new Set();

  constructor(public mangaService: MangaService, private fb: FormBuilder,private router: Router, private authService: AuthService) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: ['']
    });
    // Manual manga entry
    this.filteredMangas.push({
      id: 1,
      title: 'Naruto',
      releaseYear: 1999,
      category: 'Action'
    });

  }
  logout() {
        this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.mangaService.getMangas().subscribe({
      next: (data) => {
        this.mangas = data;
        this.filteredMangas = data;
      },
      error: (error) => {
        console.error('Failed to fetch mangas:', error);
      }
    });

    this.searchForm.valueChanges.subscribe(val => {
      this.filterMangas(val.searchTerm, val.category);
    });
  }

  filterMangas(searchTerm: string, category: string): void {
    let tempMangas = this.mangas;

    if (searchTerm) {
      tempMangas = tempMangas.filter(manga => manga.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category && category !== 'All') {
      tempMangas = tempMangas.filter(manga => manga.category.includes(category));
    }

    this.filteredMangas = tempMangas;
  }
  /*
  addToFavorites(manga: any): void {
    this.mangaService.addToFavorites(manga);
  }

  isFavorite(mangaId: number): boolean {
    return this.mangaService.getFavorites().some(fav => fav.id === mangaId);
  }
  */
  addToFavorites(manga: any): void {
    this.favorites.add(manga.id);
  }

  removeFromFavorites(mangaId: number): void {
    this.favorites.delete(mangaId);
  }

  isFavorite(mangaId: number): boolean {
    return this.favorites.has(mangaId);
  }
}
