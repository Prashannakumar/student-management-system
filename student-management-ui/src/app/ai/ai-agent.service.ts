import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiResponse {
  intent: string;
  actionId: string | null;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class AiAgentService {

  private apiUrl = 'http://localhost:8080/api/ai-agent';

  constructor(private http: HttpClient) {}

  process(userInput: string, context: any): Observable<AiResponse> {
    return this.http.post<AiResponse>(this.apiUrl, {
      userInput,
      context
    });
  }
}