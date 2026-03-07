import { toInitials } from '@lib/template'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

interface AvatarProps {
  src?: string
}

export function Avatar(props: AvatarProps) {
  const { src } = props

  const user = { name: 'John Doe' } // TODO: user from jotai

  return (
    <AvatarPrimitive.Root className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-card-foreground align-middle font-medium text-base text-card select-none">
      <AvatarPrimitive.Image
        alt={user.name}
        className="size-full object-cover"
        height={32}
        src={src}
        width={32}
      />
      <AvatarPrimitive.Fallback delayMs={200}>
        {toInitials(user.name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
