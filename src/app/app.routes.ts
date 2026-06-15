import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          ),
      },
      {
        path: 'users',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'providers',
        loadComponent: () =>
          import('./features/providers/provider-list/provider-list.component').then(
            (m) => m.ProviderListComponent
          ),
      },
      {
        path: 'initiatives',
        loadComponent: () =>
          import('./features/initiatives/initiative-list/initiative-list.component').then(
            (m) => m.InitiativeListComponent
          ),
      },
      {
        path: 'external-resources',
        loadComponent: () =>
          import('./features/external-resources/external-resource-list/external-resource-list.component').then(
            (m) => m.ExternalResourceListComponent
          ),
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('./features/assignments/assignment-list/assignment-list.component').then(
            (m) => m.AssignmentListComponent
          ),
      },
      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('./features/purchase-orders/purchase-order-list/purchase-order-list.component').then(
            (m) => m.PurchaseOrderListComponent
          ),
      },
      {
        path: 'assignments/new',
        loadComponent: () =>
          import('./features/assignments/assignment-form/assignment-form.component').then(
            (m) => m.AssignmentFormComponent
          ),
      },
      {
        path: 'assignments/:id/edit',
        loadComponent: () =>
          import('./features/assignments/assignment-form/assignment-form.component').then(
            (m) => m.AssignmentFormComponent
          ),
      },
      {
        path: 'assignments/:id',
        loadComponent: () =>
          import('./features/assignments/assignment-detail/assignment-detail.component').then(
            (m) => m.AssignmentDetailComponent
          ),
      },
      {
        path: 'imports/historical',
        loadComponent: () =>
          import('./features/imports/historical-import/historical-import.component').then(
            (m) => m.HistoricalImportComponent
          ),
      },
      {
        path: 'imports/history',
        loadComponent: () =>
          import('./features/imports/import-history/import-history.component').then(
            (m) => m.ImportHistoryComponent
          ),
      },
      {
        path: 'imports/:batchId/errors',
        loadComponent: () =>
          import('./features/imports/import-errors/import-errors.component').then(
            (m) => m.ImportErrorsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
