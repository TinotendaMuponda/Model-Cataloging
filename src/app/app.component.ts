import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <header class="app-header">
    <div class="branding">
      <cds-icon shape="network-globe" size="lg" style="color:white; margin-right: 0.5rem; vertical-align: middle;"></cds-icon>
      <span class="title" routerLink="/" style="cursor:pointer">LLM Catalog</span>
      <span class="subtitle">Powered by OpenRouter</span>
    </div>
    <nav class="header-nav">
      <a class="header-nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
        <cds-icon shape="grid-view" size="sm"></cds-icon> Catalog
      </a>
      <a class="header-nav-link" routerLink="/documentation" routerLinkActive="active">
        <cds-icon shape="book" size="sm"></cds-icon> Docs
      </a>
    </nav>
  </header>
  <main class="content-container">
    <router-outlet></router-outlet>
  </main>
  `,
  styles: [`
    .header-nav {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .header-nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 0.84rem;
      font-weight: 500;
      padding: 0.3rem 0.75rem;
      border-radius: 5px;
      transition: background 0.15s, color 0.15s;
    }
    .header-nav-link:hover,
    .header-nav-link.active {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
  `]
})
export class AppComponent { }
