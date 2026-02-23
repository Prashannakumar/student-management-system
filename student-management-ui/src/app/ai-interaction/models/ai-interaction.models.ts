export interface AiActionMetadata {
    id: string;
    description: string;
    requiredRole?: string;
    parameters?: AiActionParameter[];
}

export interface AiActionParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    description: string;
    required: boolean;
}

export type AiIntent = 'navigate' | 'form_fill' | 'fetch_data' | 'custom';

export interface AiResponse {
    intent: AiIntent;
    actionId: string;
    payload: any;
}

export interface RegisteredAction {
    metadata: AiActionMetadata;
    instance: any;
    methodName: string;
}

export interface AiContext {
    activeActions: AiActionMetadata[];
    currentUserRoles: string[];
    currentRoute: string;
    forms?: any[];
}
/**
 * Interface for Role-Based Access Control.
 * Users should provide an implementation of this service.
 */
export abstract class AiAuthService {
    abstract getUserRoles(): string[];
}
