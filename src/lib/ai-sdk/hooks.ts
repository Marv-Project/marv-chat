import { useLocalStorage } from 'usehooks-ts'
import { DEFAULT_CHAT_MODEL } from './config'

export function useSelectedModel() {
  return useLocalStorage('selected-model', DEFAULT_CHAT_MODEL)
}
