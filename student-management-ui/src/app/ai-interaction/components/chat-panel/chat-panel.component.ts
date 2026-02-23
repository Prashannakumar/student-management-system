import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiClientService } from '../../services/ai-client.service';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';

interface Message {
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

@Component({
    selector: 'app-chat-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="ai-chat-container" [class.minimized]="isMinimized()">
      <!-- Header -->
      <div class="ai-chat-header" (click)="toggleMinimize()">
        <span class="ai-title">Enterprise AI Assistant</span>
        <button class="minimize-btn">{{ isMinimized() ? '▲' : '▼' }}</button>
      </div>

      <!-- Content -->
      <div class="ai-chat-content" *ngIf="!isMinimized()">
        <div class="history">
          <div *ngFor="let msg of history()" 
               class="message-bubble" 
               [class.user]="msg.sender === 'user'"
               [class.ai]="msg.sender === 'ai'">
            {{ msg.text }}
          </div>
          <div *ngIf="isProcessing()" class="message-bubble ai typing">
            Thinking...
          </div>
        </div>

        <div class="input-area">
          <input type="text" 
                 [(ngModel)]="userInput" 
                 (keyup.enter)="sendMessage()" 
                 placeholder="Type a command..."
                 [disabled]="isProcessing()"/>
          <button (click)="sendMessage()" [disabled]="isProcessing() || !userInput()">
            Send
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .ai-chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      max-height: 500px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    .ai-chat-container.minimized {
      width: 250px;
      max-height: 48px;
    }

    .ai-chat-header {
      padding: 12px 16px;
      background: linear-gradient(135deg, #2b32b2 0%, #1488cc 100%);
      color: white;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .minimize-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.2rem;
    }

    .ai-chat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
      overflow: hidden;
    }

    .history {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 200px;
    }

    .message-bubble {
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 0.9rem;
    }

    .message-bubble.user {
      align-self: flex-end;
      background: #007bff;
      color: white;
      border-bottom-right-radius: 2px;
    }

    .message-bubble.ai {
      align-self: flex-start;
      background: #f1f0f0;
      color: #333;
      border-bottom-left-radius: 2px;
    }

    .typing {
      font-style: italic;
      color: #777;
    }

    .input-area {
      display: flex;
      gap: 8px;
    }

    input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      outline: none;
    }

    button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ChatPanelComponent {
    private aiClient = inject(AiClientService);
    private dispatcher = inject(ActionDispatcherService);

    userInput = signal('');
    isMinimized = signal(true);
    isProcessing = signal(false);
    history = signal<Message[]>([]);

    toggleMinimize() {
        this.isMinimized.update(v => !v);
    }

    sendMessage() {
        const text = this.userInput().trim();
        if (!text) return;

        // Add user message to history
        this.history.update(h => [...h, { text, sender: 'user', timestamp: new Date() }]);
        this.userInput.set('');
        this.isProcessing.set(true);

        this.aiClient.sendMessage(text).subscribe({
            next: (response) => {
                this.isProcessing.set(false);
                this.history.update(h => [...h, {
                    text: `Executing: ${response.intent} (${response.actionId})`,
                    sender: 'ai',
                    timestamp: new Date()
                }]);

                // Dispatch the action
                this.dispatcher.dispatch(response);
            },
            error: (err) => {
                this.isProcessing.set(false);
                this.history.update(h => [...h, {
                    text: 'Error communicating with AI backend.',
                    sender: 'ai',
                    timestamp: new Date()
                }]);
            }
        });
    }
}
