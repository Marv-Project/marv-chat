import { google } from '@ai-sdk/google'

export const getTitleModel = () => {
  return google.languageModel('gemini-2.5-flash')
}

export const getLanguageModel = () => {
  return google.languageModel('gemini-2.5-flash')
}
