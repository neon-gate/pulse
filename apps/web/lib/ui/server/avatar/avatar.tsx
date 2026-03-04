import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { toInitials } from '@lib/ui/display/format'

interface AvatarProps {
  src?: string
}

export function Avatar(props: AvatarProps) {
  const { src } = props

  const user = { name: 'John Doe' } // TODO: user from jotai

  return (
    <div className="flex gap-2">
      <AvatarPrimitive.Root className="rounded-full bg-card-foreground align-middle font-medium text-card select-none">
        <AvatarPrimitive.Image src={src} width="32" height="32" />
        <AvatarPrimitive.Fallback className="flex size-8 items-center justify-center text-base">
          {toInitials(user.name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    </div>
  )
}
