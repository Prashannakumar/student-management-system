import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionRegistryService } from './action-registry.service';
import { FormRegistryService } from './form-registry.service';
import { AiResponse, AiAuthService } from '../models/ai-interaction.models';

@Injectable({
    providedIn: 'root'
})
export class ActionDispatcherService {
    private actionRegistry = inject(ActionRegistryService);
    private formRegistry = inject(FormRegistryService);
    private router = inject(Router);
    private authService = inject(AiAuthService, { optional: true });

    /**
     * Safe execution of AI response.
     * @param response The response from the AI backend
     */
    dispatch(response: AiResponse): void {
        const { intent, actionId, payload } = response;

        // 1. Security check: Is this action allowed for the current user?
        const roles = this.authService ? this.authService.getUserRoles() : [];
        const registeredAction = this.actionRegistry.getAction(actionId);

        if (!registeredAction) {
            console.error(`Rejected unauthorized actionId: ${actionId}. Not in registry.`);
            return;
        }

        if (registeredAction.metadata.requiredRole && !roles.includes(registeredAction.metadata.requiredRole)) {
            console.error(`Rejected unauthorized execution of ${actionId} for current user roles.`);
            return;
        }

        // 2. Handle intents
        switch (intent) {
            case 'navigate':
                this.handleNavigation(actionId, payload);
                break;
            case 'form_fill':
                this.handleFormFill(actionId, payload);
                break;
            case 'fetch_data':
            case 'custom':
                this.handleCustomAction(actionId, payload);
                break;
            default:
                console.error(`Unknown intent: ${intent}`);
        }
    }

    private handleNavigation(actionId: string, payload: any): void {
        // Navigation can be a simple route or a custom handler
        if (payload && payload.route) {
            this.router.navigate([payload.route], { queryParams: payload.queryParams });
        } else {
            // Fallback to custom action if route is not explicitly in payload
            this.handleCustomAction(actionId, payload);
        }
    }

    private handleFormFill(actionId: string, payload: any): void {
        if (payload && payload.formName && payload.fields) {
            this.formRegistry.fillForm(payload.formName, payload.fields);
        } else {
            // Fallback to custom action
            this.handleCustomAction(actionId, payload);
        }
    }

    private handleCustomAction(actionId: string, payload: any): void {
        const action = this.actionRegistry.getAction(actionId);
        if (action && action.instance && action.methodName) {
            const method = action.instance[action.methodName];
            if (typeof method === 'function') {
                method.apply(action.instance, [payload]);
            }
        }
    }
}
