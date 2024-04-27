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
  

  ngOnInit(): void {
    this.mangaService.getMangas().subscribe(mangas => {
      this.mangas = mangas;
      this.filteredMangas = mangas;
      this.updateFavoritesSet();
    });

    this.searchForm.valueChanges.subscribe(val => {
      this.filterMangas(val.searchTerm, val.category);
    });
  }
  logout() {
    this.router.navigate(['/login']);
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
  addToFavorites(manga: Manga): void {
    this.mangaService.addToFavorites(manga).subscribe({
      next: () => {
        this.favorites.add(manga.id);
        console.log('Added to favorites');
      },
      error: (error) => console.error('Could not add to favorites:', error)
    });
  }

  removeFromFavorites(mangaId: number): void {
    this.mangaService.removeFromFavorites(mangaId).subscribe({
      next: () => {
        this.favorites.delete(mangaId);
        console.log('Removed from favorites');
      },
      error: (error) => console.error('Could not remove from favorites:', error)
    });
  }

  isFavorite(mangaId: number): boolean {
    return this.favorites.has(mangaId);
  }
  private updateFavoritesSet(): void {
    const favorites = this.mangaService.getFavorites();
    this.favorites = new Set(favorites.map(fav => fav.id));
  }
}
