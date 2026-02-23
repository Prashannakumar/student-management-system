import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionRegistryService } from './action-registry.service';
import { FormRegistryService } from './form-registry.service';
import { AiContext, AiAuthService } from '../models/ai-interaction.models';

@Injectable({
    providedIn: 'root'
})
export class ContextBuilderService {
    private actionRegistry = inject(ActionRegistryService);
    private formRegistry = inject(FormRegistryService);
    private router = inject(Router);

    // Optional auth service
    private authService = inject(AiAuthService, { optional: true });

    /**
     * Build the current application context to send to the AI backend.
     */
    buildContext(): AiContext {
        const roles = this.authService ? this.authService.getUserRoles() : [];

        return {
            activeActions: this.actionRegistry.getAllowedActions(roles),
            currentUserRoles: roles,
            currentRoute: this.router.url,
            forms: this.formRegistry.getRegisteredFormNames()
        };
    }
}
