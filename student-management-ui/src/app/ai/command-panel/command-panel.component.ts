import { Component, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AiAgentService } from '../ai-agent.service';
import { AI_ACTIONS } from '../ai-actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-command-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './command-panel.component.html',
  styleUrl: './command-panel.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class CommandPanelComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('commandInput') private commandInput!: ElementRef;

  inputText = '';
  messages: any[] = [{ role: 'ai', content: 'Hello! How can I help you manage students today? (Ctrl + I to toggle)' }];
  isOpen = false;
  isLoading = false;

  constructor(
    private aiService: AiAgentService,
    private router: Router
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @HostListener('window:keydown.control.i', ['$event'])
  toggleShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.togglePanel();
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.commandInput?.nativeElement.focus(), 300);
    }
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  send() {
    if (!this.inputText.trim() || this.isLoading) return;

    const userMessage = this.inputText;
    this.messages.push({ role: 'user', content: userMessage });
    this.inputText = '';
    this.isLoading = true;

    const context = {
      availableActions: Object.keys(AI_ACTIONS).map((key: any) => ({
        id: key,
        description: AI_ACTIONS[key].route
      }))
    };

    this.aiService.process(userMessage, context)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.intent === 'navigate' && res.actionId) {
            const action = AI_ACTIONS[res.actionId];
            if (action) {
              this.router.navigateByUrl(action.route);
            }
          } else {
            this.messages.push({ role: 'ai', content: res.payload?.message || "I'm sorry, I couldn't process that." });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messages.push({ role: 'ai', content: 'Error communicating with AI service.' });
          console.error(err);
        }
      });
  }
}


