import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/public/pages/home.page').then((m) => m.HomePage),
  },
];
