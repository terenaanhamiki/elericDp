import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export default class GoogleProvider extends BaseProvider {
  name = 'Google';
  getApiKeyLink = 'https://aistudio.google.com/app/apikey';

  config = {
    apiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'gemini-2.5-flash',
      label: 'Gemini 2.5 Flash',
      provider: 'Google',
      maxTokenAllowed: 2000000,
      maxCompletionTokens: 8192,
    },
    {
      name: 'gemini-2.0-flash-exp',
      label: 'Gemini 2.0 Flash Exp',
      provider: 'Google',
      maxTokenAllowed: 1000000,
      maxCompletionTokens: 8192,
    },
    {
      name: 'gemini-exp-1206',
      label: 'Gemini Exp 1206',
      provider: 'Google',
      maxTokenAllowed: 2000000,
      maxCompletionTokens: 8192,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      headers: {
        ['Content-Type']: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models from Google API: ${response.status} ${response.statusText}`);
    }

    const res = (await response.json()) as any;

    if (!res.models || !Array.isArray(res.models)) {
      throw new Error('Invalid response format from Google API');
    }

    // Filter out models with very low token limits and experimental models
    const data = res.models.filter((model: any) => {
      const modelName = model.name.replace('models/', '');
      const hasGoodTokenLimit = (model.outputTokenLimit || 0) > 8000;
      const isExperimental = modelName.includes('-exp');
      return hasGoodTokenLimit && !isExperimental;
    });

    return data.map((m: any) => {
      const modelName = m.name.replace('models/', '');

      // Get accurate context window from Google API
      let contextWindow = 32000; // default fallback

      if (m.inputTokenLimit && m.outputTokenLimit) {
        // Use the input limit as the primary context window (typically larger)
        contextWindow = m.inputTokenLimit;
      } else if (modelName.includes('gemini-1.5-pro')) {
        contextWindow = 2000000; // Gemini 1.5 Pro has 2M context
      } else if (modelName.includes('gemini-1.5-flash')) {
        contextWindow = 1000000; // Gemini 1.5 Flash has 1M context
      } else if (modelName.includes('gemini-2.0-flash')) {
        contextWindow = 1000000; // Gemini 2.0 Flash has 1M context
      } else if (modelName.includes('gemini-pro')) {
        contextWindow = 32000; // Gemini Pro has 32k context
      } else if (modelName.includes('gemini-flash')) {
        contextWindow = 32000; // Gemini Flash has 32k context
      }

      // Cap at reasonable limits to prevent issues
      const maxAllowed = 2000000; // 2M tokens max
      const finalContext = Math.min(contextWindow, maxAllowed);

      // Get completion token limit from Google API
      let completionTokens = 8192; // default fallback (Gemini 1.5 standard limit)

      if (m.outputTokenLimit && m.outputTokenLimit > 0) {
        completionTokens = Math.min(m.outputTokenLimit, 128000); // Use API value, cap at reasonable limit
      }

      return {
        name: modelName,
        label: `${m.displayName} (${finalContext >= 1000000 ? Math.floor(finalContext / 1000000) + 'M' : Math.floor(finalContext / 1000) + 'k'} context)`,
        provider: this.name,
        maxTokenAllowed: finalContext,
        maxCompletionTokens: completionTokens,
      };
    });
  }

  getModelInstance(options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    console.log('[GoogleProvider] Creating Google AI instance with:', {
      model,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 15),
      nodeEnv: process.env.NODE_ENV,
    });

    try {
      const google = createGoogleGenerativeAI({
        apiKey: apiKey.trim(),
      });

      console.log('[GoogleProvider] Google AI instance created successfully');

      // Create model instance with safety settings to prevent blocking
      const modelInstance = google(model, {
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      });
      console.log('[GoogleProvider] Model instance created for:', model);

      return modelInstance;
    } catch (error: any) {
      console.error('[GoogleProvider] Error creating Google AI instance:', error);
      throw new Error(`Failed to create Google AI instance: ${error.message}`);
    }
  }
}
