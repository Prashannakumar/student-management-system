import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiAction {
    intent: 'navigate' | 'message';
    path?: string;
    text?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AiChatService {
    private apiUrl = 'http://localhost:8080/api/ai-agent';

    constructor(private http: HttpClient) { }

    sendMessage(message: string): Observable<AiAction> {
        const payload = { message };
        return this.http.post<AiAction>(this.apiUrl, payload);
    }
}
