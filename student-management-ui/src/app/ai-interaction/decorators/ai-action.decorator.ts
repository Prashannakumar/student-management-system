import { AiActionMetadata } from '../models/ai-interaction.models';

export const AI_ACTIONS_HOLDER = '__ai_actions__';

/**
 * Decorator to mark a method as an AI-executable action.
 * @param metadata Description and security requirements for the action.
 */
export function AiAction(metadata: Omit<AiActionMetadata, 'id'> & { id?: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target[AI_ACTIONS_HOLDER]) {
            target[AI_ACTIONS_HOLDER] = new Map<string, any>();
        }

        const actions: Map<string, any> = target[AI_ACTIONS_HOLDER];
        const actionId = metadata.id || propertyKey;

        actions.set(actionId, {
            ...metadata,
            id: actionId,
            methodName: propertyKey
        });
    };
}
