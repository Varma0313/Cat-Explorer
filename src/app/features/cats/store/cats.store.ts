import { Injectable, inject, signal } from '@angular/core';
import { CatApiService, CatRaw, CatPayload } from '../../../core/services/cat-api.service';
import { Cat } from '../../../core/models/cat.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable()
export class CatsStore {
  private readonly api = inject(CatApiService);

  readonly cats = signal<Cat[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadCats(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getCats().subscribe({
      next: (response: ApiResponse<CatRaw[]>) => {
        const cats: Cat[] = response.data.map((item: CatRaw) => ({
          id: item.id,
          name: item.info.name,
          age: item.info.age,
          description: item.info.description,
        }));
        this.cats.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cats.');
        this.loading.set(false);
      },
    });
  }

  createCat(payload: CatPayload): void {
    this.api.createCat(payload).subscribe({
      next: () => this.loadCats(),
      error: () => this.error.set('Failed to create cat.'),
    });
  }

  updateCat(id: string, payload: CatPayload): void {
    this.api.updateCat(id, payload).subscribe({
      next: () => this.loadCats(),
      error: () => this.error.set('Failed to update cat.'),
    });
  }

  deleteCat(id: string): void {
    this.api.deleteCat(id).subscribe({
      next: () => this.loadCats(),
      error: () => this.error.set('Failed to delete cat.'),
    });
  }
}
