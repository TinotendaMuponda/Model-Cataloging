import { Component, OnInit, HostListener } from '@angular/core';
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
  recentlyAdded: ModelInfo[] = [];
  loading = true;
  error = false;
  searchQuery = '';

  // ── Filter state ────────────────────────────────────────
  selectedModality   = '';
  selectedPricing    = '';   // '' | 'free' | 'paid'
  selectedContext    = '';   // '' | 'xs' | 'sm' | 'md' | 'lg'
  selectedProvider     = '';
  providerDropdownOpen = false;
  selectedCapabilities: Set<string> = new Set(); // multi-select: 'tools' | 'vision' | 'web_search' | 'discount'
  multiProviderOnly    = false;    // show only models with > 1 provider
  loadingProviderCounts = false;   // true while fetching endpoint counts
  sortBy               = 'default';
  filtersOpen        = false;

  // ── Derived option lists ─────────────────────────────────
  modalityOptions: string[] = [];
  providerOptions: string[] = [];

  readonly contextBuckets = [
    { label: 'Any',      value: '' },
    { label: '≤ 32K',    value: 'xs' },
    { label: '32K–128K', value: 'sm' },
    { label: '128K–1M',  value: 'md' },
    { label: '1M+',      value: 'lg' },
  ];

  readonly capabilityOptions = [
    { label: 'Tool Use',   value: 'tools',      icon: 'cog',     cls: 'cap-tools'    },
    { label: 'Vision',     value: 'vision',     icon: 'image',   cls: 'cap-vision'   },
    { label: 'Web Search', value: 'web_search', icon: 'world',   cls: 'cap-web'      },
    { label: 'Discount',   value: 'discount',   icon: 'tag',     cls: 'cap-discount' },
  ];

  readonly sortOptions = [
    { label: 'Default',             value: 'default' },
    { label: 'Name A → Z',          value: 'name' },
    { label: 'Newest first',         value: 'newest' },
    { label: 'Context (high → low)', value: 'context_desc' },
    { label: 'Context (low → high)', value: 'context_asc' },
    { label: 'Price (low → high)',   value: 'price' },
  ];

  get activeFilterCount(): number {
    return [
      this.selectedModality,
      this.selectedPricing,
      this.selectedContext,
      this.selectedProvider,
      this.sortBy !== 'default' ? this.sortBy : '',
      this.multiProviderOnly ? 'mp' : '',
    ].filter(Boolean).length + this.selectedCapabilities.size;
  }

  toggleCapability(value: string): void {
    if (this.selectedCapabilities.has(value)) {
      this.selectedCapabilities.delete(value);
    } else {
      this.selectedCapabilities.add(value);
    }
    // Reassign so Angular detects change
    this.selectedCapabilities = new Set(this.selectedCapabilities);
    this.applyFilters();
  }

  toggleMultiProvider(): void {
    this.multiProviderOnly = !this.multiProviderOnly;

    if (!this.multiProviderOnly) {
      this.applyFilters();
      return;
    }

    // If counts already loaded, just filter immediately
    if (this.modelsService.endpointCountsLoaded) {
      this.applyFilters();
      return;
    }

    // First toggle: fetch all endpoint counts lazily (10 concurrent)
    this.loadingProviderCounts = true;
    this.modelsService.loadAllEndpointCounts(
      this.allModels,
      (id, count) => {
        const m = this.allModels.find(x => x.id === id);
        if (m) m.num_endpoints = count;
        // Re-apply filter progressively as counts arrive
        this.applyFilters();
      }
    ).subscribe({
      complete: () => {
        this.loadingProviderCounts = false;
        this.applyFilters();
      },
      error: () => {
        this.loadingProviderCounts = false;
      }
    });
  }

  // ── Capability helpers ───────────────────────────────────
  hasTools(m: ModelInfo): boolean {
    return (m.supported_parameters ?? []).some(p =>
      p === 'tools' || p === 'tool_choice');
  }

  hasVision(m: ModelInfo): boolean {
    const mod = m.architecture?.modality ?? '';
    const inputs = m.architecture?.input_modalities ?? [];
    return mod.includes('image') || inputs.includes('image');
  }

  hasWebSearch(m: ModelInfo): boolean {
    return !!(m.pricing?.web_search);
  }

  isFree(m: ModelInfo): boolean {
    return m.pricing?.prompt === '0';
  }

  hasDiscount(m: ModelInfo): boolean {
    return !!(m.pricing?.discount && m.pricing.discount < 1);
  }

  getDiscountPct(m: ModelInfo): string {
    if (!m.pricing?.discount) return '';
    return Math.round((1 - m.pricing.discount) * 100) + '% off';
  }

  constructor(private modelsService: ModelsService, private router: Router) {}

  @HostListener('document:click', ['$event.target'])
  onDocClick(target: HTMLElement): void {
    if (!target.closest('.provider-dropdown')) {
      this.providerDropdownOpen = false;
    }
  }

  ngOnInit(): void {
    this.modelsService.listModels().subscribe({
      next: list => {
        this.allModels = list;

        // Build option lists from live data
        const modSet = new Set<string>();
        const provSet = new Set<string>();
        for (const m of list) {
          if (m.architecture?.modality) modSet.add(m.architecture.modality);
          const prov = m.id.split('/')[0];
          if (prov) provSet.add(prov);
        }
        this.modalityOptions = Array.from(modSet).sort();
        this.providerOptions  = Array.from(provSet).sort();

        this.recentlyAdded = list
          .filter(m => this.isRecentlyAdded(m.created))
          .sort((a, b) => (b.created ?? 0) - (a.created ?? 0));

        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSearch(query: string): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase();

    let result = this.allModels.filter(m => {
      // Text search
      if (q && !(
        (m.name || m.id).toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.id || '').toLowerCase().includes(q)
      )) return false;

      // Modality
      if (this.selectedModality && m.architecture?.modality !== this.selectedModality) return false;

      // Pricing
      if (this.selectedPricing === 'free' && m.pricing?.prompt !== '0') return false;
      if (this.selectedPricing === 'paid' && m.pricing?.prompt === '0') return false;

      // Context window
      const ctx = m.context_length ?? 0;
      if (this.selectedContext === 'xs' && !(ctx > 0 && ctx <= 32_000)) return false;
      if (this.selectedContext === 'sm' && !(ctx > 32_000 && ctx <= 128_000)) return false;
      if (this.selectedContext === 'md' && !(ctx > 128_000 && ctx <= 1_000_000)) return false;
      if (this.selectedContext === 'lg' && !(ctx > 1_000_000)) return false;

      // Provider
      if (this.selectedProvider && m.id.split('/')[0] !== this.selectedProvider) return false;

      // Multi-provider only — only exclude when count is known and is ≤ 1
      if (this.multiProviderOnly && m.num_endpoints != null && m.num_endpoints <= 1) return false;

      // Capability (AND — model must have ALL selected capabilities)
      if (this.selectedCapabilities.has('tools')      && !this.hasTools(m))      return false;
      if (this.selectedCapabilities.has('vision')     && !this.hasVision(m))     return false;
      if (this.selectedCapabilities.has('web_search') && !this.hasWebSearch(m))  return false;
      if (this.selectedCapabilities.has('discount')   && !this.hasDiscount(m))   return false;

      return true;
    });

    // Sort
    switch (this.sortBy) {
      case 'name':
        result = result.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
        break;
      case 'newest':
        result = result.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
        break;
      case 'context_desc':
        result = result.sort((a, b) => (b.context_length ?? 0) - (a.context_length ?? 0));
        break;
      case 'context_asc':
        result = result.sort((a, b) => (a.context_length ?? 0) - (b.context_length ?? 0));
        break;
      case 'price':
        result = result.sort((a, b) => parseFloat(a.pricing?.prompt || '999') - parseFloat(b.pricing?.prompt || '999'));
        break;
    }

    this.models = result;
  }

  clearFilters(): void {
    this.selectedModality   = '';
    this.selectedPricing    = '';
    this.selectedContext    = '';
    this.selectedProvider      = '';
    this.selectedCapabilities  = new Set();
    this.multiProviderOnly     = false;
    this.sortBy                = 'default';
    this.searchQuery        = '';
    this.applyFilters();
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

  isRecentlyAdded(createdAt?: number): boolean {
    if (!createdAt) return false;
    const fourteenDaysAgo = Date.now() / 1000 - 14 * 24 * 60 * 60;
    return createdAt > fourteenDaysAgo;
  }

  formatDate(ts?: number): string {
    if (!ts) return '';
    return new Date(ts * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
