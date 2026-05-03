import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <!-- Route progress bar -->
  <div class="route-progress-bar" [class.active]="navigating"></div>

  <header class="app-header">
    <div class="branding">
      <cds-icon shape="network-globe" size="lg" style="color:white; margin-right: 0.5rem; vertical-align: middle;"></cds-icon>
      <span class="title" routerLink="/" style="cursor:pointer">LLM Catalog</span>
      <span class="subtitle">Powered by OpenRouter</span>
    </div>
    <nav class="header-nav">
      <div class="nav-dropdown" [class.open]="menuOpen" (click)="$event.stopPropagation()">
        <button class="nav-dd-trigger" (click)="menuOpen = !menuOpen" type="button">
          <cds-icon shape="ellipsis-vertical" size="md"></cds-icon>
        </button>
        <div class="nav-dd-menu" *ngIf="menuOpen">
          <a class="nav-dd-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen = false">
            <cds-icon shape="grid-view" size="sm"></cds-icon>
            <span>Catalog</span>
            <span class="nav-dd-desc">Browse all available models</span>
          </a>
          <a class="nav-dd-item" routerLink="/docs" routerLinkActive="active" (click)="menuOpen = false">
            <cds-icon shape="book" size="sm"></cds-icon>
            <span>Docs</span>
            <span class="nav-dd-desc">How to use this application</span>
          </a>
        </div>
      </div>
    </nav>
    <div class="nav-backdrop" *ngIf="menuOpen" (click)="menuOpen = false"></div>
  </header>
  <main class="content-container" [class.route-loading]="navigating">
    <router-outlet></router-outlet>
  </main>
  `,
  styles: [`
    .route-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #0073b9, #00a8e8);
      z-index: 9999;
      opacity: 0;
      border-radius: 0 2px 2px 0;
      transition: none;
    }
    .route-progress-bar.active {
      opacity: 1;
      width: 85%;
      transition: width 8s cubic-bezier(0.1, 0.05, 0.0, 1.0);
    }
    .content-container {
      transition: opacity 0.15s ease;
    }
    .content-container.route-loading {
      opacity: 0.5;
    }
    .header-nav {
      margin-left: auto;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 400;
    }
    .nav-dd-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.85);
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .nav-dd-trigger:hover,
    .nav-dropdown.open .nav-dd-trigger {
      background: rgba(255,255,255,0.18);
      color: #fff;
    }
    .nav-caret { display: none; }
    .nav-dropdown { position: relative; }
    .nav-dd-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #fff;
      border: 1px solid #dce3ea;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.16);
      min-width: 220px;
      padding: 6px 0;
      z-index: 500;
    }
    .nav-dd-item {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-template-rows: auto auto;
      align-items: center;
      column-gap: 0.6rem;
      padding: 0.6rem 1rem;
      color: #1a2332;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      transition: background 0.1s;
    }
    .nav-dd-item:hover { background: #f0f6fb; }
    .nav-dd-item.active { color: #0073b9; }
    .nav-dd-item cds-icon { grid-row: 1 / 3; color: #0073b9; }
    .nav-dd-desc {
      grid-column: 2;
      font-size: 0.76rem;
      font-weight: 400;
      color: #8a99aa;
      margin-top: 1px;
    }
    .nav-backdrop {
      position: fixed;
      inset: 0;
      z-index: 399;
    }
  `]
})
export class AppComponent {
  menuOpen = false;
  navigating = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => { this.navigating = false; }, 200);
      }
    });
  }
}
