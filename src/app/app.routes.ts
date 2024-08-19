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
    path: 'register',
    loadComponent: () => import('./pages/authentication/components/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/home/components/user/user.page').then( m => m.UserPage),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.User],
    }
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/home/components/admin/admin.page').then( m => m.AdminPage),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.User, Role.Admin],
    }
  },
  {
    path: 'owner',
    loadComponent: () => import('./pages/home/components/owner/owner.page').then( m => m.OwnerPage),
    canActivate: [AuthGuard],
    data: {
      roles: [Role.User, Role.Admin, Role.Owner],
    }
  },
];