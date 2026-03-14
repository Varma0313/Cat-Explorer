import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Cat } from '../../../../core/models/cat.model';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './cat-card.html',
  styleUrl: './cat-card.scss',
})
export class CatCard {
  readonly cat = input.required<Cat>();
  readonly edit = output<Cat>();
  readonly delete = output<string>();

  readonly isExpanded = signal<boolean>(false);

  readonly avatarColor = computed<string>(() => {
    const colors: string[] = [
      '#0D9488',
      '#8B5CF6',
      '#F59E0B',
      '#10B981',
      '#F43F5E',
      '#3B82F6',
      '#EC4899',
      '#6366F1',
    ];
    return colors[this.cat().name.charCodeAt(0) % colors.length];
  });

  toggleExpand(): void {
    this.isExpanded.update((v) => !v);
  }

  editCat(): void {
    this.edit.emit(this.cat());
  }

  deleteCat(): void {
    this.delete.emit(this.cat().id!);
  }
}
