import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  adminOnly?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  @Input() expanded = true;
  @Input() mobile = false;
  @Output() navClick = new EventEmitter<void>();
  @Output() toggleExpanded = new EventEmitter<void>();

  readonly navGroups: NavGroup[] = [
    {
      title: 'Principal',
      items: [{ label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard' }],
    },
    {
      title: 'Gestión',
      items: [
        { label: 'Usuarios', route: '/users', icon: 'group', adminOnly: true },
        { label: 'Proveedores', route: '/providers', icon: 'storefront' },
        { label: 'Iniciativas', route: '/initiatives', icon: 'flag' },
        { label: 'Recursos externos', route: '/external-resources', icon: 'badge' },
        { label: 'Asignaciones', route: '/assignments', icon: 'assignment_ind' },
        { label: 'Órdenes de compra', route: '/purchase-orders', icon: 'receipt_long' },
      ],
    },
    {
      title: 'Importación',
      items: [
        { label: 'Importar Excel', route: '/imports/historical', icon: 'upload_file' },
        { label: 'Historial', route: '/imports/history', icon: 'history' },
      ],
    },
  ];

  get visibleGroups(): NavGroup[] {
    return this.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.adminOnly || this.isAdmin()),
      }))
      .filter((group) => group.items.length > 0);
  }

  get isCollapsed(): boolean {
    return !this.expanded && !this.mobile;
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  onNavClick(): void {
    this.navClick.emit();
  }

  onToggle(): void {
    this.toggleExpanded.emit();
  }
}
