import { useEffect, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
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
import { DEFAULT_CHAT_MODEL, aiChatModelsConfig } from '@/lib/ai-sdk/config'
import { useSelectedModel } from '@/lib/ai-sdk/hooks'

const modelNameLookup = new Map(
  aiChatModelsConfig.flatMap((p) => p.models.map((m) => [m.id, m.name])),
)

export const ChatModelSelector = () => {
  const [selectedModel, setSelectedModel] = useSelectedModel()
  // Prevent hydration mismatch by using the default model during SSR
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Use the default model during SSR to match server-rendered content
  const displayModel = isHydrated ? selectedModel : DEFAULT_CHAT_MODEL

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton variant="ghost" size="sm">
          <span className="max-w-32 truncate">
            {modelNameLookup.get(displayModel) ?? displayModel}
          </span>
          <ChevronDownIcon className="size-3.5 opacity-50" />
        </InputGroupButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-64">
        <DropdownMenuRadioGroup
          value={selectedModel}
          onValueChange={setSelectedModel}
        >
          {aiChatModelsConfig.map((provider, i) => (
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
