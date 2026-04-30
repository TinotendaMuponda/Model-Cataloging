import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ModelsService, ModelInfo, ModelEndpoint, ModelEndpointsResponse } from '../models.service';

@Component({
  selector: 'app-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.css']
})
export class ModelDetailComponent implements OnInit {
  model: ModelInfo | null = null;
  endpoints: ModelEndpoint[] = [];
  endpointsDetail: ModelEndpointsResponse | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '';
    const id = decodeURIComponent(rawId);
    const detailsPath = `/api/v1/models/${id}/endpoints`;

    forkJoin({
      models: this.modelsService.listModels(),
      endpointsData: this.modelsService.getModelEndpoints(detailsPath)
    }).subscribe(({ models, endpointsData }) => {
      this.model = models.find(m => m.id === id) || null;
      this.endpointsDetail = endpointsData;
      this.endpoints = endpointsData?.endpoints ?? [];
      this.notFound = !this.model;
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price?: string): string {
    if (!price || price === '0') return 'Free';
    const num = parseFloat(price);
    if (isNaN(num)) return '-';
    return '$' + (num * 1_000_000).toFixed(4) + ' / M tokens';
  }

  formatContext(len?: number): string {
    if (!len) return '-';
    if (len >= 1_000_000) return (len / 1_000_000).toFixed(1) + 'M tokens';
    if (len >= 1000) return (len / 1000).toFixed(0) + 'K tokens';
    return len.toString() + ' tokens';
  }

  formatLatency(ms?: number | null): string {
    if (ms == null) return '-';
    if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
    return Math.round(ms) + 'ms';
  }

  formatThroughput(tps?: number | null): string {
    if (tps == null) return '-';
    return tps.toFixed(0) + ' t/s';
  }

  formatDate(ts?: number): string {
    if (!ts) return '-';
    return new Date(ts * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getUptimeClass(uptime?: number | null): string {
    if (uptime == null) return '';
    if (uptime >= 99) return 'uptime-good';
    if (uptime >= 95) return 'uptime-warn';
    return 'uptime-bad';
  }

  getLatencyClass(ms?: number | null): string {
    if (ms == null) return '';
    if (ms < 500)  return 'perf-good';
    if (ms < 1500) return 'perf-warn';
    return 'perf-bad';
  }

  getThroughputClass(tps?: number | null): string {
    if (tps == null) return '';
    if (tps >= 100) return 'perf-good';
    if (tps >= 30)  return 'perf-warn';
    return 'perf-bad';
  }

  getDiscountPct(discount?: number): string {
    if (!discount || discount >= 1) return '';
    return Math.round((1 - discount) * 100) + '% off';
  }

  get providerCount(): number {
    return this.endpoints.length;
  }

  get cheapestProvider(): ModelEndpoint | null {
    const paid = this.endpoints.filter(e => e.pricing?.prompt && e.pricing.prompt !== '0');
    if (!paid.length) return null;
    return paid.reduce((a, b) =>
      parseFloat(a.pricing?.prompt ?? '999') <= parseFloat(b.pricing?.prompt ?? '999') ? a : b
    );
  }

  get bestUptimeProvider(): ModelEndpoint | null {
    const withUptime = this.endpoints.filter(e => e.uptime_last_1d != null);
    if (!withUptime.length) return null;
    return withUptime.reduce((a, b) =>
      (a.uptime_last_1d ?? 0) >= (b.uptime_last_1d ?? 0) ? a : b
    );
  }

  get fastestProvider(): ModelEndpoint | null {
    const withLatency = this.endpoints.filter(e => e.latency_last_30m != null);
    if (!withLatency.length) return null;
    return withLatency.reduce((a, b) =>
      (a.latency_last_30m ?? 9999) <= (b.latency_last_30m ?? 9999) ? a : b
    );
  }
}
