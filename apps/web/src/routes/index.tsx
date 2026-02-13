import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@marv-chat/ui/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <h1>App</h1>
      <Button>Button</Button>
    </div>
  )
}
