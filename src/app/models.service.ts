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
}

@Injectable({ providedIn: 'root' })
export class ModelsService {
  private apiUrl = 'https://openrouter.ai/api/v1/models';

  constructor(private http: HttpClient) {}

  listModels(): Observable<ModelInfo[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        // API returns { data: [...] }
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
}
