import {
  google as googleProvider,
  GoogleGenerativeAIProviderOptions,
} from '@ai-sdk/google'
import {
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai'

export const google = customProvider({
  languageModels: {
    'gemini-2.5-flash-reasoning': wrapLanguageModel({
      model: googleProvider('gemini-2.5-flash'),
      providerId: 'google',
      modelId: 'gemini-2.5-flash',
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 8192,
                includeThoughts: true,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        },
      }),
    }),

    'gemini-2.5-flash': googleProvider('gemini-2.5-flash'),

    'gemini-2.5-flash-lite-reasoning': wrapLanguageModel({
      model: googleProvider('gemini-2.5-flash-lite'),
      providerId: 'google',
      modelId: 'gemini-2.5-flash-lite',
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 8192,
                includeThoughts: true,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        },
      }),
    }),

    'gemini-2.5-flash-lite': googleProvider('gemini-2.5-flash-lite'),
  },

  fallbackProvider: googleProvider,
})
