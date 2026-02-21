import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../services/ai-chat.service';
import { Router } from '@angular/router';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-chat-container">
      <!-- Floating Button -->
      <button class="chat-toggle-btn" (click)="toggleChat()">
        <i class="bi bi-chat-dots-fill"></i>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isOpen">
        <div class="chat-header">
          <span>AI Assistant</span>
          <button class="btn-close btn-close-white" (click)="toggleChat()"></button>
        </div>
        
        <div class="chat-body" #chatBody>
          <div *ngFor="let msg of messages" [ngClass]="{'user-msg': msg.sender === 'user', 'ai-msg': msg.sender === 'ai'}">
            <div class="message-bubble">{{ msg.text }}</div>
          </div>
          <div *ngIf="isLoading" class="ai-msg">
            <div class="message-bubble typing">AI is thinking...</div>
          </div>
        </div>

        <div class="chat-footer">
          <input type="text" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" placeholder="Type a message..." [disabled]="isLoading">
          <button (click)="sendMessage()" [disabled]="isLoading">
            <i class="bi bi-send-fill"></i>
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
      z-index: 1000;
    }
    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #0d6efd;
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 24px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .chat-toggle-btn:hover {
      transform: scale(1.1);
    }
    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-header {
      background: #0d6efd;
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
    }
    .chat-body {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background: #f8f9fa;
    }
    .chat-footer {
      padding: 10px;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 10px;
    }
    .chat-footer input {
      flex: 1;
      border: 1px solid #dee2e6;
      border-radius: 20px;
      padding: 8px 15px;
      outline: none;
    }
    .chat-footer button {
      background: #0d6efd;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    .message-bubble {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.4;
    }
    .user-msg {
      display: flex;
      justify-content: flex-end;
    }
    .user-msg .message-bubble {
      background: #0d6efd;
      color: white;
      border-bottom-right-radius: 4px;
    }
    .ai-msg .message-bubble {
      background: #e9ecef;
      color: #212529;
      border-bottom-left-radius: 4px;
    }
    .typing {
      font-style: italic;
      color: #6c757d;
    }
  `]
})
export class AiChatComponent {
  isOpen = false;
  userInput = '';
  messages: Message[] = [
    { text: 'Hello! I am your AI assistant. How can I help you today?', sender: 'ai' }
  ];
  isLoading = false;

  constructor(private aiService: AiChatService, private router: Router) { }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;

    this.aiService.sendMessage(userMessage).subscribe({
      next: (action) => {
        this.isLoading = false;
        this.processAiAction(action);
      },
      error: (error) => {
        this.isLoading = false;
        this.messages.push({ text: 'Error: Could not connect to AI service.', sender: 'ai' });
      }
    });
  }

  private processAiAction(action: any) {
    if (action.intent === 'navigate' && action.path) {
      this.messages.push({ text: `Navigating to ${action.path}...`, sender: 'ai' });
      setTimeout(() => {
        this.router.navigate([action.path]);
        this.isOpen = false;
      }, 1000);
    } else if (action.intent === 'message' && action.text) {
      this.messages.push({ text: action.text, sender: 'ai' });
    } else {
      this.messages.push({ text: 'I received an unrecognized command.', sender: 'ai' });
    }
  }
}
