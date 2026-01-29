import { AppLoader } from './app-loader'

export const PendingComponent = () => {
  return (
    <div className="from-muted/50 to-background h-svh w-full bg-linear-to-b from-30%">
      <div className="container grid h-full w-full max-w-xl items-center justify-center">
        <AppLoader variant="dots" size="lg" />
      </div>
    </div>
  )
}
