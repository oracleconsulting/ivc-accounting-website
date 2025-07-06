export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  apiKeyRequired: boolean;
  baseUrl?: string;
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  supportsStreaming: boolean;
  costPer1kTokens: number;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    apiKeyRequired: true,
    models: [
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', maxTokens: 128000, supportsStreaming: true, costPer1kTokens: 0.01 },
      { id: 'gpt-4', name: 'GPT-4', maxTokens: 8192, supportsStreaming: true, costPer1kTokens: 0.03 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385, supportsStreaming: true, costPer1kTokens: 0.001 }
    ]
  },
  {
    id: 'anthropic',
    name: 'Claude (Anthropic)',
    apiKeyRequired: true,
    models: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', maxTokens: 200000, supportsStreaming: true, costPer1kTokens: 0.015 },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', maxTokens: 200000, supportsStreaming: true, costPer1kTokens: 0.003 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 200000, supportsStreaming: true, costPer1kTokens: 0.00025 }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    apiKeyRequired: true,
    models: [
      { id: 'pplx-70b-online', name: 'Perplexity 70B Online', maxTokens: 4096, supportsStreaming: true, costPer1kTokens: 0.007 },
      { id: 'pplx-7b-online', name: 'Perplexity 7B Online', maxTokens: 4096, supportsStreaming: true, costPer1kTokens: 0.0007 }
    ]
  },
  {
    id: 'grok',
    name: 'Grok (xAI)',
    apiKeyRequired: true,
    models: [
      { id: 'grok-beta', name: 'Grok Beta', maxTokens: 8192, supportsStreaming: true, costPer1kTokens: 0.005 }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Multi-Provider)',
    apiKeyRequired: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo (via OpenRouter)', maxTokens: 128000, supportsStreaming: true, costPer1kTokens: 0.01 },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (via OpenRouter)', maxTokens: 200000, supportsStreaming: true, costPer1kTokens: 0.015 },
      { id: 'google/gemini-pro', name: 'Gemini Pro (via OpenRouter)', maxTokens: 32768, supportsStreaming: true, costPer1kTokens: 0.00125 }
    ]
  }
]; 