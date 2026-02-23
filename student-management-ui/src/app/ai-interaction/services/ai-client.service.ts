import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiContext, AiResponse } from '../models/ai-interaction.models';
import { ContextBuilderService } from './context-builder.service';

@Injectable({
    providedIn: 'root'
})
export class AiClientService {
    private http = inject(HttpClient);
    private contextBuilder = inject(ContextBuilderService);

    private readonly apiUrl = '/api/ai-agent';

    /**
     * Send user input to the AI backend and receive intent/action.
     * @param userInput The literal message from the user
     */
    sendMessage(userInput: string): Observable<AiResponse> {
        const context = this.contextBuilder.buildContext();
        const payload = {
            message: userInput,
            context: context
        };

        return this.http.post<AiResponse>(this.apiUrl, payload);
    }
}
