import { Injectable } from '@angular/core';
import { AiActionMetadata, RegisteredAction } from '../models/ai-interaction.models';

@Injectable({
    providedIn: 'root'
})
export class ActionRegistryService {
    private actions = new Map<string, RegisteredAction>();

    /**
     * Register an action with the registry.
     * @param metadata The action metadata (description, role, etc.)
     * @param instance The instance of the class containing the method
     * @param methodName The name of the method to execute
     */
    registerAction(metadata: AiActionMetadata, instance: any, methodName: string): void {
        if (this.actions.has(metadata.id)) {
            console.warn(`Action with ID "${metadata.id}" is already registered. Overwriting.`);
        }
        this.actions.set(metadata.id, { metadata, instance, methodName });
    }

    /**
     * Unregister actions for a specific instance (useful when components are destroyed).
     * @param instance The component instance
     */
    unregisterActions(instance: any): void {
        for (const [id, action] of this.actions.entries()) {
            if (action.instance === instance) {
                this.actions.delete(id);
            }
        }
    }

    /**
     * Get an action by its ID.
     * @param id The action ID
     */
    getAction(id: string): RegisteredAction | undefined {
        return this.actions.get(id);
    }

    /**
     * Get all actions filtered by the user's current roles.
     * @param userRoles The roles assigned to the current user
     */
    getAllowedActions(userRoles: string[]): AiActionMetadata[] {
        return Array.from(this.actions.values())
            .filter(action => {
                if (!action.metadata.requiredRole) {
                    return true;
                }
                return userRoles.includes(action.metadata.requiredRole);
            })
            .map(action => action.metadata);
    }
}
