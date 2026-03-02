export type AiIntentType =
  | 'navigate'
  | 'fill_form'
  | 'submit_form'
  | 'fetch_data'
  | 'unknown';

export interface AiIntent {
  intent: AiIntentType;
  actionId?: string;
  payload?: any;
  message?: string;
}