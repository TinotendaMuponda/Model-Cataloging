import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <header class="app-header">
    <div class="branding">
      <span class="title" routerLink="/" style="cursor:pointer">Model Capability</span>
      <span class="subtitle">Powered by OpenRouter</span>
    </div>
  </header>
  <main class="content-container">
    <router-outlet></router-outlet>
  </main>
  `
})   
export class AppComponent { }
