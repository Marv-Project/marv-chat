import { InputGroupButton } from '@/components/ui/input-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AI_MODELS_CONFIG } from '@/lib/ai-sdk/config'
import { ChevronDownIcon } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'

const DEFAULT_MODEL = AI_MODELS_CONFIG[0].models[0].id

const modelNameLookup = new Map(
  AI_MODELS_CONFIG.flatMap((p) => p.models.map((m) => [m.id, m.name])),
)

export function useSelectedModel() {
  return useLocalStorage('selected-model', DEFAULT_MODEL)
}

export const ChatModelSelector = () => {
  const [selectedModel, setSelectedModel] = useSelectedModel()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton variant="ghost" size="sm">
          <span className="max-w-32 truncate">
            {modelNameLookup.get(selectedModel) ?? selectedModel}
          </span>
          <ChevronDownIcon className="size-3.5 opacity-50" />
        </InputGroupButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-64">
        <DropdownMenuRadioGroup
          value={selectedModel}
          onValueChange={setSelectedModel}
        >
          {AI_MODELS_CONFIG.map((provider, i) => (
            <div key={provider.id}>
              {i > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
              {provider.models.map((model) => (
                <DropdownMenuRadioItem key={model.id} value={model.id}>
                  {model.name}
                </DropdownMenuRadioItem>
              ))}
            </div>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
