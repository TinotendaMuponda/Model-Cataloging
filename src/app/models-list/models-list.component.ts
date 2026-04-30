import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelsService, ModelInfo } from '../models.service';

@Component({
  selector: 'models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.css']
})
export class ModelsListComponent implements OnInit {
  allModels: ModelInfo[] = [];
  models: ModelInfo[] = [];
  loading = true;
  error = false;
  searchQuery = '';

  constructor(private modelsService: ModelsService, private router: Router) {}

  ngOnInit(): void {
    this.modelsService.listModels().subscribe({
      next: list => {
        this.allModels = list;
        this.models = list;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.models = this.allModels.filter(m =>
      (m.name || m.id).toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q) ||
      (m.id || '').toLowerCase().includes(q)
    );
  }

  formatPrice(price?: string): string {
    if (!price || price === '0') return 'Free';
    const num = parseFloat(price);
    if (isNaN(num)) return '-';
    return '$' + (num * 1_000_000).toFixed(2) + ' / M tokens';
  }

  formatContext(len?: number): string {
    if (!len) return '-';
    if (len >= 1_000_000) return (len / 1_000_000).toFixed(1) + 'M';
    if (len >= 1000) return (len / 1000).toFixed(0) + 'K';
    return len.toString();
  }

  openDetail(model: ModelInfo): void {
    this.router.navigate(['/', encodeURIComponent(model.id)]);
  }
}
