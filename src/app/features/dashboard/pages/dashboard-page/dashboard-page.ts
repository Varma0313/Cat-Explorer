import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatsStore } from '../../../cats/store/cats.store';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  readonly store = inject(CatsStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadCats();
  }

  goToCats(): void {
    this.router.navigate(['/cats']);
  }

  getAvatarColor(name: string): string {
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
    return colors[name.charCodeAt(0) % colors.length];
  }

  exportCsv(): void {
    const cats = this.store.cats();
    if (cats.length === 0) return;

    const headers = ['Name', 'Age', 'Description'];
    const rows = cats.map((c) => [`"${c.name}"`, `"${c.age}"`, `"${c.description}"`]);
    const csvContent = '\uFEFF' + [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `cats-export-${new Date().toISOString().slice(0, 10)}.csv`;
    saveAs(blob, fileName);
  }

}
