import { Routes } from '@angular/router';
import { AuthGuard } from './pages/authentication/services/guards/auth.guard';
import { Role } from './models/enums/role.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/authentication/components/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then( m => m.UserPage),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.User],
    }
  },
];
// https://devdactic.com/login-ionic-2