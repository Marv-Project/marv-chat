import { IconExclamationCircle, IconHome } from '@tabler/icons-react'
import { RefreshCcwIcon } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const ErrorComponent = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const isDev = process.env.NODE_ENV !== 'production'

  const queryClientErrorBoundary = useQueryErrorResetBoundary()

  const handleClickRefresh = () => {
    void router.invalidate()
  }

  useEffect(() => {
    queryClientErrorBoundary.reset()
  }, [queryClientErrorBoundary])

  return (
    <div className="from-muted/50 to-background h-svh w-full bg-linear-to-b from-30%">
      <div className="container grid h-full w-full max-w-xl items-center justify-center">
        <Empty className="h-fit">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="text-destructive">
              <IconExclamationCircle />
            </EmptyMedia>
            <EmptyTitle>Oops! Something went wrong</EmptyTitle>
            <EmptyDescription>
              We&apos;re sorry, but we encountered an unexpected error.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClickRefresh}
            >
              <RefreshCcwIcon />
              Refresh
            </Button>

            <Button type="button" asChild>
              <Link to="/" viewTransition>
                <IconHome /> Home
              </Link>
            </Button>
          </EmptyContent>

          {isDev && (
            <Accordion type="single" className="mx-auto w-full" collapsible>
              <AccordionItem value="error-details">
                <AccordionTrigger>View error details</AccordionTrigger>
                <AccordionContent className="text-start">
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="mb-2 font-semibold">Error Message:</h3>
                    <p className="mb-4 text-sm">{error.message}</p>
                    <h3 className="mb-2 font-semibold">Stack Trace:</h3>
                    <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </Empty>
      </div>
    </div>
  )
}
