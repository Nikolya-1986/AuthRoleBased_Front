import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/authentication/components/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
// https://devdactic.com/login-ionic-2