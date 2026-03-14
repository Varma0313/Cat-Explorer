import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CatsStore } from '../../store/cats.store';
import { CatCard } from '../../components/cat-card/cat-card';
import { CreateCatDialog } from '../../components/create-cat-dialog/create-cat-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cat } from '../../../../core/models/cat.model';

@Component({
  selector: 'app-cats-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatCard, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './cats-page.html',
  styleUrl: './cats-page.scss',
  providers: [CatsStore],
})
export class CatsPage implements OnInit {
  // All inject() — no constructor pattern mixed in
  readonly store = inject(CatsStore);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.store.loadCats();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCatDialog, {
      width: '480px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.store.loadCats();
    });
  }

  editCat(cat: Cat): void {
    const dialogRef = this.dialog.open(CreateCatDialog, {
      width: '480px',
      data: cat,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.store.loadCats();
    });
  }

  deleteCat(id: string): void {
    this.store.deleteCat(id);
  }
}
