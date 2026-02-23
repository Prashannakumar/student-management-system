import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatPanelComponent } from './ai-interaction/components/chat-panel/chat-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent, ChatPanelComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
    <app-chat-panel></app-chat-panel>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'student-management-ui';
}
