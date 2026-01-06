import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({ component: App })

function App() {
  return (
    <div>
      <h1>App</h1>
    </div>
  )
}
