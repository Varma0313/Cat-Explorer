import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateCatDialog } from './features/cats/components/create-cat-dialog/create-cat-dialog';
import { signal } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly isCatsPage = signal<boolean>(false);

  constructor() {
    // Check initial URL including /cats
    const currentUrl = this.router.url;
    this.isCatsPage.set(currentUrl.includes('/cats'));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isCatsPage.set(e.urlAfterRedirects.includes('/cats'));
      });
  }

  openCreateDialog(): void {
    this.dialog.open(CreateCatDialog, { width: '480px', data: null });
  }
}
