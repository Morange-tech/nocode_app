export interface ServiceResponse<T = any> {
  data: T | null;
  error: { message: string; code?: string; status?: number } | null;
}

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent;
  new?: T;
  old?: T;
  commit_timestamp: string;
}