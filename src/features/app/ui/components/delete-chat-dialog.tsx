import { useRouter } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDeleteChat } from '@/hooks/chat/use-delete-chat'

interface DeleteChatDialogProps {
  chatId: string
  chatTitle: string
  isCurrentChat: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteChatDialog = ({
  chatId,
  chatTitle,
  isCurrentChat,
  open,
  onOpenChange,
}: DeleteChatDialogProps) => {
  const router = useRouter()
  const { mutate, isPending } = useDeleteChat()

  const handleDelete = () => {
    mutate(
      { chatId },
      {
        onSuccess: () => {
          onOpenChange(false)
          if (isCurrentChat) {
            void router.navigate({ to: '/', viewTransition: true })
          }
        },
      },
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{chatTitle}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <Trash2Icon />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
