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
  </header>
  <main class="content-container">
    <router-outlet></router-outlet>
  </main>
  `
})
export class AppComponent { }
