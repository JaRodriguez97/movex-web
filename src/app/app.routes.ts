import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/live-monitoreo/live-monitoreo.component').then(m => m.LiveMonitoreoComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'recargas',
        loadComponent: () => import('./pages/recargas/recargas.component').then(m => m.RecargasComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./pages/servicios/servicios.component').then(m => m.ServiciosComponent)
      },
      {
        path: 'mi-cuenta',
        loadComponent: () => import('./pages/mi-cuenta/mi-cuenta.component').then(m => m.MiCuentaComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent)
      }
    ]
  },
  {
    path: 'landing-premium',
    loadComponent: () => import('./pages/landing-premium/landing-premium.component').then(m => m.LandingPremiumComponent)
  },
  // Redirecciones por compatibilidad hacia atrás
  { path: 'live-monitoreo', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'clientes', redirectTo: 'dashboard/clientes', pathMatch: 'full' },
  { path: 'recargas', redirectTo: 'dashboard/recargas', pathMatch: 'full' },
  { path: 'servicios', redirectTo: 'dashboard/servicios', pathMatch: 'full' },
  { path: 'mi-cuenta', redirectTo: 'dashboard/mi-cuenta', pathMatch: 'full' },
  { path: 'tickets', redirectTo: 'dashboard/tickets', pathMatch: 'full' }
];

