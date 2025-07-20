
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

// Represents a single message in a chat
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

// Represents the model configuration for a chat session
export interface ModelConfig {
  systemInstruction: string;
  temperature: number;
  topP: number;
  topK: number;
}

// Represents a full chat session
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  config: ModelConfig;
}

// Defines the possible views in the app
export type AppView = 'chat' | 'settings';
