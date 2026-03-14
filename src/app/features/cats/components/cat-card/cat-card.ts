import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Cat } from '../../../../core/models/cat.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cat-card.html',
  styleUrl: './cat-card.scss',
})
export class CatCard {
  // Signal-based input — Angular 17+
  readonly cat = input.required<Cat>();

  // Signal-based output — no EventEmitter needed
  readonly edit = output<Cat>();
  readonly delete = output<string>();

  editCat(): void {
    this.edit.emit(this.cat());
  }

  deleteCat(): void {
    this.delete.emit(this.cat().id!);
  }
}
