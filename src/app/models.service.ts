import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ModelArchitecture {
  modality?: string;
  input_modalities?: string[];
  output_modalities?: string[];
  tokenizer?: string;
}

export interface ModelPricing {
  prompt?: string;
  completion?: string;
  image?: string;
  web_search?: string;
  discount?: number;
}

export interface ModelLinks {
  details?: string;
}

export interface ModelEndpoint {
  name?: string;
  provider_name?: string;
  tag?: string;
  context_length?: number;
  max_completion_tokens?: number;
  quantization?: string;
  pricing?: ModelPricing;
  supported_parameters?: string[];
  status?: number;
  uptime_last_30m?: number;
  uptime_last_5m?: number;
  uptime_last_1d?: number;
  latency_last_30m?: number | null;
  throughput_last_30m?: number | null;
  supports_implicit_caching?: boolean;
}

export interface ModelEndpointsResponse {
  id?: string;
  name?: string;
  description?: string;
  architecture?: ModelArchitecture;
  endpoints?: ModelEndpoint[];
}

export interface ModelInfo {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  created?: number;
  architecture?: ModelArchitecture;
  pricing?: ModelPricing;
  supported_parameters?: string[];
  links?: ModelLinks;
}

@Injectable({ providedIn: 'root' })
export class ModelsService {
  private apiBase = 'https://openrouter.ai';
  private apiUrl = `${this.apiBase}/api/v1/models`;

  constructor(private http: HttpClient) {}

  listModels(): Observable<ModelInfo[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        if (res && Array.isArray(res.data)) return res.data as ModelInfo[];
        if (Array.isArray(res)) return res as ModelInfo[];
        return [];
      }),
      catchError(err => {
        console.error('Failed to load models', err);
        return of([]);
      })
    );
  }

  getModelEndpoints(detailsPath: string): Observable<ModelEndpointsResponse | null> {
    return this.http.get<any>(`${this.apiBase}${detailsPath}`).pipe(
      map(res => {
        // OpenRouter may return { data: { endpoints: [...] } } or the object directly
        const payload = res?.data ?? res;
        return payload as ModelEndpointsResponse ?? null;
      }),
      catchError(err => {
        console.error('Failed to load model endpoints', err);
        return of(null);
      })
    );
  }
}
