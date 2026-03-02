import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionExecutorService } from './action-executor.service';
import { CapabilityRegistryService } from './capability-registry.service';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiOrchestratorService {

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private executor: ActionExecutorService,
    private registry: CapabilityRegistryService
  ) { }

  process(userInput: string) {
    if (!userInput.trim()) return;

    // Add user message to history
    this.addMessage('user', userInput);
    this.isLoadingSubject.next(true);

    const payload = {
      userInput,
      context: this.registry.buildContextSnapshot()
    };

    this.http
      .post<any>('http://localhost:8080/api/ai-agent', payload)
      .subscribe({
        next: (res) => {
          this.isLoadingSubject.next(false);
          this.handleIntent(res);
        },
        error: (err) => {
          this.isLoadingSubject.next(false);
          console.error('AI API error:', err);
          this.addMessage('ai', 'Sorry, I encountered an error. Please try again.');
        }
      });
  }

  private addMessage(role: 'user' | 'ai', text: string) {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, { role, text, timestamp: new Date() }]);
  }

  private handleIntent(res: any) {

    console.log('AI RESPONSE:', res);

    if (res.message) {
      this.addMessage('ai', res.message);
    }

    switch (res.intent) {

      case 'navigate':
        if (res.payload?.route) {
          this.executor.navigate(res.payload.route);
        }
        break;

      case 'fill_form':
        if (res.payload) {
          this.executor.fillForm(res.payload);
        }
        break;

      case 'submit_form':
        this.executor.submitForm();
        break;

      case 'respond':
        // Message already handled above
        break;

      default:
        console.warn('Unknown AI intent:', res.intent);
    }
  }
}