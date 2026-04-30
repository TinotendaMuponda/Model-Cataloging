import { Component, Input, OnChanges } from '@angular/core';

/** Maps OpenRouter provider slug → primary domain for Clearbit logo lookup */
const PROVIDER_DOMAINS: Record<string, string> = {
  'openai':              'openai.com',
  '~openai':             'openai.com',
  'anthropic':           'anthropic.com',
  '~anthropic':          'anthropic.com',
  'google':              'google.com',
  '~google':             'google.com',
  'meta-llama':          'meta.com',
  'mistralai':           'mistral.ai',
  'cohere':              'cohere.com',
  'deepseek':            'deepseek.com',
  'nvidia':              'nvidia.com',
  'x-ai':                'x.ai',
  'amazon':              'amazon.com',
  'microsoft':           'microsoft.com',
  'perplexity':          'perplexity.ai',
  'qwen':                'qwen.ai',
  'alibaba':             'alibaba.com',
  'bytedance':           'bytedance.com',
  'bytedance-seed':      'bytedance.com',
  'tencent':             'tencent.com',
  'baidu':               'baidu.com',
  'ibm-granite':         'ibm.com',
  'moonshotai':          'moonshot.cn',
  '~moonshotai':         'moonshot.cn',
  'minimax':             'minimax.io',
  'rekaai':              'reka.ai',
  'upstage':             'upstage.ai',
  'writer':              'writer.com',
  'inflection':          'inflection.ai',
  'ai21':                'ai21.com',
  'arcee-ai':            'arcee.ai',
  'liquid':              'liquid.ai',
  'nousresearch':        'nousresearch.com',
  'allenai':             'allenai.org',
  'openrouter':          'openrouter.ai',
  'stepfun':             'stepfun.com',
  'poolside':            'poolside.ai',
  'inception':           'inceptionlabs.ai',
  'switchpoint':         'switchpoint.ai',
  'prime-intellect':     'primeintellect.ai',
  'deepcogito':          'deepcogito.com',
  'morph':               'morph.so',
};

/** Deterministic hue from a string — used for the fallback avatar */
function slugToHue(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % 360;
}

/** Return 1–2 uppercase initials from a provider slug */
function initials(slug: string): string {
  const clean = slug.replace(/^~/, '');
  const parts = clean.split(/[-_]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

@Component({
  selector: 'app-provider-logo',
  template: `
    <span class="prov-logo-wrap" [style.width.px]="px" [style.height.px]="px">
      <img *ngIf="logoUrl && !imgError"
           [src]="logoUrl"
           [alt]="provider"
           [style.width.px]="px"
           [style.height.px]="px"
           class="prov-logo-img"
           (error)="imgError = true" />
      <span *ngIf="!logoUrl || imgError"
            class="prov-logo-fallback"
            [style.width.px]="px"
            [style.height.px]="px"
            [style.background]="fallbackBg"
            [style.font-size.px]="px * 0.38">
        {{ abbr }}
      </span>
    </span>
  `,
  styles: [`
    .prov-logo-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: 4px;
      overflow: hidden;
      vertical-align: middle;
    }
    .prov-logo-img {
      object-fit: contain;
      display: block;
      border-radius: 4px;
    }
    .prov-logo-fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: #fff;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1;
      font-family: inherit;
    }
  `]
})
export class ProviderLogoComponent implements OnChanges {
  @Input() provider = '';
  /** Pixel size — 20 | 24 | 28 | 32 | 36 */
  @Input() size: number = 24;

  logoUrl = '';
  abbr    = '';
  fallbackBg = '';
  imgError   = false;
  px = 24;

  ngOnChanges(): void {
    this.imgError = false;
    this.px = this.size;
    const slug    = (this.provider || '').toLowerCase();
    const domain  = PROVIDER_DOMAINS[slug];
    this.logoUrl  = domain
      ? `https://logo.clearbit.com/${domain}?size=${this.px * 2}`
      : '';
    this.abbr       = initials(slug || '?');
    const hue       = slugToHue(slug);
    this.fallbackBg = `hsl(${hue}, 55%, 42%)`;
  }
}
