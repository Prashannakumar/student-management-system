import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AiAgentService } from '../ai-agent.service';
import { AI_ACTIONS } from '../ai-actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-command-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './command-panel.component.html',
  styleUrl: './command-panel.component.scss'
})
export class CommandPanelComponent {

  inputText = '';
  messages: any[] = [];

  constructor(
    private aiService: AiAgentService,
    private router: Router
  ) {}

  send() {
    if (!this.inputText.trim()) return;

    const userMessage = this.inputText;
    this.messages.push({ role: 'user', content: userMessage });

    const context = {
      availableActions: Object.keys(AI_ACTIONS).map((key: any) => ({
        id: key,
        description: AI_ACTIONS[key].route
      }))
    };

    this.aiService.process(userMessage, context)
      .subscribe(res => {

        if (res.intent === 'navigate' && res.actionId) {
          const action = AI_ACTIONS[res.actionId];
          if (action) {
            this.router.navigateByUrl(action.route);
          }
        } else {
          this.messages.push({ role: 'ai', content: res.payload?.message });
        }

      });

    this.inputText = '';
  }
}


