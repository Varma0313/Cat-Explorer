import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CatsStore } from '../../store/cats.store';
import { CatCard } from '../../components/cat-card/cat-card';
import { CreateCatDialog } from '../../components/create-cat-dialog/create-cat-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Cat } from '../../../../core/models/cat.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cats-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatCard],
  templateUrl: './cats-page.html',
  styleUrl: './cats-page.scss',
})
export class CatsPage implements OnInit {
  readonly store = inject(CatsStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  readonly skeletons = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.store.loadCats();
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
    //  Store removes from signal immediately
    this.store.deleteCat(id);
    this.snackBar.open('🗑️ Cat deleted!', 'Close', {
      duration: 3000,
      panelClass: 'snack-success',
    });
  }
}
