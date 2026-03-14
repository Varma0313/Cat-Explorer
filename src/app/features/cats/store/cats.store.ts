import { Injectable, inject, signal, computed } from '@angular/core';
import { CatApiService, CatRaw, CatPayload } from '../../../core/services/cat-api.service';
import { Cat } from '../../../core/models/cat.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CatsStore {
  private readonly api = inject(CatApiService);

  readonly cats = signal<Cat[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredCats = computed<Cat[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.cats();
    return this.cats().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.age.toString().includes(q),
    );
  });

  // Dashboard stats — computed here, used by both pages
  readonly totalCats = computed(() => this.cats().length);

  readonly avgAge = computed(() => {
    const cats = this.cats();
    if (cats.length === 0) return '0';
    const total = cats.reduce((sum, c) => sum + Number(c.age), 0);
    return (total / cats.length).toFixed(1);
  });

  readonly youngestCat = computed(() => {
    const cats = this.cats();
    if (cats.length === 0) return null;
    return cats.reduce((min, c) => (Number(c.age) < Number(min.age) ? c : min));
  });

  readonly oldestCat = computed(() => {
    const cats = this.cats();
    if (cats.length === 0) return null;
    return cats.reduce((max, c) => (Number(c.age) > Number(max.age) ? c : max));
  });

  setSearch(query: string): void {
    this.searchQuery.set(query);
  }

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
        this.error.set('Failed to load cats. Please try again.');
        this.loading.set(false);
      },
    });
  }

  createCat(payload: CatPayload): void {
    this.api.createCat(payload).subscribe({
      next: (response: ApiResponse<CatRaw>) => {
        const newCat: Cat = {
          id: response.data.id,
          name: response.data.info.name,
          age: response.data.info.age,
          description: response.data.info.description,
        };
        //  Add to existing list immediately
        this.loadCats();
        this.cats.update((list) => [newCat, ...list]);
      },
      error: () => this.error.set('Failed to create cat.'),
    });
  }

  updateCat(id: string, payload: CatPayload): void {
    this.api.updateCat(id, payload).subscribe({
      next: () => {
        //  Optimistic update — update in list immediately
        this.cats.update((list) =>
          list.map((c) =>
            c.id === id
              ? { ...c, name: payload.name, age: payload.age, description: payload.description }
              : c,
          ),
        );
      },
      error: () => this.error.set('Failed to update cat.'),
    });
  }

  deleteCat(id: string): void {
    this.api.deleteCat(id).subscribe({
      next: () => {
        this.loadCats(); // Reload list — shows flicker/refresh
      },
      error: () => {
        this.error.set('Failed to delete cat.');
      },
    });
  }
}
