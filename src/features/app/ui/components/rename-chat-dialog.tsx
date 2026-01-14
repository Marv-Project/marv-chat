import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRenameChat } from '@/hooks/chat/use-rename-chat'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

const renameChatSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100),
})

interface RenameChatDialogProps {
  chatId: string
  chatTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenameChatDialog({
  chatId,
  chatTitle,
  open,
  onOpenChange,
}: RenameChatDialogProps) {
  const { mutate, isPending } = useRenameChat()

  const form = useForm({
    defaultValues: {
      title: chatTitle,
    },
    validators: {
      onSubmit: renameChatSchema,
      onChange: renameChatSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        { chatId, title: value.title },
        {
          onSuccess: () => {
            onOpenChange(false)
          },
        },
      )
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Make changes to your chat name here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="rename-chat-form"
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Chat name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Chat name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={form.state.isSubmitting || isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="rename-chat-form"
            disabled={form.state.isSubmitting || isPending}
          >
            {form.state.isSubmitting || isPending ? <Spinner /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
