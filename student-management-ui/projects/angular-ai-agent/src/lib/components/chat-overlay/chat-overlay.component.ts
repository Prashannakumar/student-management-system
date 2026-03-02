import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiOrchestratorService } from '../../core/ai-orchestrator.service';

@Component({
  selector: 'ai-chat-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss']
})
export class ChatOverlayComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  input = '';
  isOpen = false;
  messages$ = this.orchestrator.messages$;
  isLoading$ = this.orchestrator.isLoading$;

  constructor(private orchestrator: AiOrchestratorService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  send() {
    if (this.input.trim()) {
      this.orchestrator.process(this.input);
      this.input = '';
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}