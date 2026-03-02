import { Component } from '@angular/core';
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
export class ChatOverlayComponent {

  input = '';

  constructor(private orchestrator: AiOrchestratorService) {}

  send() {
    this.orchestrator.process(this.input);
    this.input = '';
  }
}