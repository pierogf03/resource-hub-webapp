import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

const SIDEBAR_EXPANDED_KEY = 'rp_sidebar_expanded';
const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 72;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  sidebarExpanded = signal(true);

  ngOnInit(): void {
    const stored = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (stored !== null) {
      this.sidebarExpanded.set(stored === 'true');
    }
  }

  get sidebarWidth(): number {
    return this.sidebarExpanded() ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;
  }

  toggleSidebar(): void {
    const next = !this.sidebarExpanded();
    this.sidebarExpanded.set(next);
    localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(next));
  }

  closeDrawerOnMobile(): void {
    this.drawer?.close();
  }

  openMobileDrawer(): void {
    this.drawer?.open();
  }
}
