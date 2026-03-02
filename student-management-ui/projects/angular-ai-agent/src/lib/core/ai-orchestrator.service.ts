import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionExecutorService } from './action-executor.service';
import { CapabilityRegistryService } from './capability-registry.service';

@Injectable({
  providedIn: 'root'
})
export class AiOrchestratorService {

  constructor(
    private http: HttpClient,
    private executor: ActionExecutorService,
    private registry: CapabilityRegistryService
  ) {}

  process(userInput: string) {

    const payload = {
      userInput,
      context: this.registry.buildContextSnapshot()
    };

    this.http
      .post<any>('http://localhost:8080/api/ai-agent', payload)
      .subscribe({
        next: (res) => this.handleIntent(res),
        error: (err) => {
          console.error('AI API error:', err);
        }
      });
  }

  private handleIntent(res: any) {

    console.log('AI RESPONSE:', res);

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
        console.log('AI Message:', res.message);
        break;

      default:
        console.warn('Unknown AI intent:', res.intent);
    }
  }
}