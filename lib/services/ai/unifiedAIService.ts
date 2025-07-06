import { AI_PROVIDERS, AIProvider, AIModel } from '@/lib/types/ai-providers';

export interface AIGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  provider?: string;
  model?: string;
}

export interface AIGenerationResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  provider: string;
  model: string;
}

export class UnifiedAIService {
  private providers: Map<string, any> = new Map();
  private apiKeys: Map<string, string> = new Map();
  
  constructor() {
    // Initialize API keys from environment
    this.initializeAPIKeys();
  }

  private initializeAPIKeys() {
    const keys = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY,
      grok: process.env.GROK_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY
    };

    Object.entries(keys).forEach(([provider, key]) => {
      if (key) {
        this.apiKeys.set(provider, key);
      }
    });
  }

  async initialize() {
    // Lazy load providers based on available API keys
    for (const [provider, apiKey] of this.apiKeys) {
      if (apiKey) {
        await this.initializeProvider(provider, apiKey);
      }
    }
  }

  private async initializeProvider(providerId: string, apiKey: string) {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    switch (providerId) {
      case 'openai':
        this.providers.set(providerId, { type: 'openai', apiKey });
        break;
      case 'anthropic':
        this.providers.set(providerId, { type: 'anthropic', apiKey });
        break;
      case 'perplexity':
        this.providers.set(providerId, { type: 'perplexity', apiKey });
        break;
      case 'grok':
        this.providers.set(providerId, { type: 'grok', apiKey });
        break;
      case 'openrouter':
        this.providers.set(providerId, { type: 'openrouter', apiKey });
        break;
    }
  }
  
  async generateContent(
    agentType: 'research' | 'writing' | 'social',
    prompt: string,
    options: AIGenerationOptions = {}
  ): Promise<AIGenerationResult> {
    const defaultConfig = await this.getDefaultConfig(agentType);
    const providerId = options.provider || defaultConfig.provider;
    const modelId = options.model || defaultConfig.model;

    if (!this.providers.has(providerId)) {
      throw new Error(`Provider ${providerId} not initialized. Please check API key configuration.`);
    }

    const provider = this.providers.get(providerId);
    const apiKey = this.apiKeys.get(providerId);

    if (!apiKey) {
      throw new Error(`API key not found for provider ${providerId}`);
    }

    return this.callProvider(providerId, apiKey, modelId, prompt, options);
  }

  private async getDefaultConfig(agentType: string) {
    // Get default configuration from database or use fallbacks
    try {
      const response = await fetch('/api/ai/settings');
      const settings = await response.json();
      return settings.provider_config?.[agentType] || {
        provider: 'openrouter',
        model: 'anthropic/claude-3-haiku'
      };
    } catch (error) {
      // Fallback defaults
      const defaults = {
        research: { provider: 'openrouter', model: 'anthropic/claude-3-opus' },
        writing: { provider: 'openrouter', model: 'openai/gpt-4-turbo' },
        social: { provider: 'openrouter', model: 'anthropic/claude-3-haiku' }
      };
      return defaults[agentType as keyof typeof defaults] || defaults.research;
    }
  }

  private async callProvider(
    providerId: string,
    apiKey: string,
    modelId: string,
    prompt: string,
    options: AIGenerationOptions
  ): Promise<AIGenerationResult> {
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2000;

    switch (providerId) {
      case 'openai':
        return this.callOpenAI(apiKey, modelId, prompt, temperature, maxTokens);
      case 'anthropic':
        return this.callAnthropic(apiKey, modelId, prompt, temperature, maxTokens);
      case 'perplexity':
        return this.callPerplexity(apiKey, modelId, prompt, temperature, maxTokens);
      case 'grok':
        return this.callGrok(apiKey, modelId, prompt, temperature, maxTokens);
      case 'openrouter':
        return this.callOpenRouter(apiKey, modelId, prompt, temperature, maxTokens);
      default:
        throw new Error(`Unsupported provider: ${providerId}`);
    }
  }

  private async callOpenAI(apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number): Promise<AIGenerationResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const modelInfo = AI_PROVIDERS.find(p => p.id === 'openai')?.models.find(m => m.id === model);
    const cost = this.calculateCost(data.usage.total_tokens, modelInfo?.costPer1kTokens || 0.01);

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost
      },
      provider: 'openai',
      model
    };
  }

  private async callAnthropic(apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number): Promise<AIGenerationResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${data.error?.message || 'Unknown error'}`);
    }

    const modelInfo = AI_PROVIDERS.find(p => p.id === 'anthropic')?.models.find(m => m.id === model);
    const cost = this.calculateCost(data.usage.input_tokens + data.usage.output_tokens, modelInfo?.costPer1kTokens || 0.003);

    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        cost
      },
      provider: 'anthropic',
      model
    };
  }

  private async callPerplexity(apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number): Promise<AIGenerationResult> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Perplexity API error: ${data.error?.message || 'Unknown error'}`);
    }

    const modelInfo = AI_PROVIDERS.find(p => p.id === 'perplexity')?.models.find(m => m.id === model);
    const cost = this.calculateCost(data.usage.total_tokens, modelInfo?.costPer1kTokens || 0.007);

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost
      },
      provider: 'perplexity',
      model
    };
  }

  private async callGrok(apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number): Promise<AIGenerationResult> {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Grok API error: ${data.error?.message || 'Unknown error'}`);
    }

    const modelInfo = AI_PROVIDERS.find(p => p.id === 'grok')?.models.find(m => m.id === model);
    const cost = this.calculateCost(data.usage.total_tokens, modelInfo?.costPer1kTokens || 0.005);

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost
      },
      provider: 'grok',
      model
    };
  }

  private async callOpenRouter(apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number): Promise<AIGenerationResult> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC AI Assistant'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${data.error?.message || 'Unknown error'}`);
    }

    // OpenRouter provides cost information directly
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost: data.usage.total_cost || 0
      },
      provider: 'openrouter',
      model
    };
  }

  private calculateCost(totalTokens: number, costPer1kTokens: number): number {
    return (totalTokens / 1000) * costPer1kTokens;
  }
  
  async testConnection(providerId: string, apiKey: string): Promise<boolean> {
    try {
      // Test with a simple prompt
      const testPrompt = "Hello, this is a connection test. Please respond with 'OK' if you can see this message.";
      
      const result = await this.callProvider(providerId, apiKey, 'test', testPrompt, {
        temperature: 0,
        maxTokens: 10
      });
      
      return result.content.toLowerCase().includes('ok');
    } catch (error) {
      console.error(`Connection test failed for ${providerId}:`, error);
      return false;
    }
  }

  getAvailableProviders(): AIProvider[] {
    return AI_PROVIDERS.filter(provider => this.apiKeys.has(provider.id));
  }

  getProviderModels(providerId: string): AIModel[] {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    return provider?.models || [];
  }
} 