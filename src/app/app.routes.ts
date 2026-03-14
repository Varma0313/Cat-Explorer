import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/cats/pages/cats-page/cats-page').then((m) => m.CatsPage),
  },
];
