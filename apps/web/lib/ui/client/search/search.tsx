import { cn } from '@lib/ui/helpers'

interface SearchProps {
  className?: string
}

export function Search(props: SearchProps) {
  const { className } = props

  const tw = cn('max-w-[400px] place-self-center mobile-hidden', className)

  return (
    <search>
      <form className={tw} name="search">
        <input type="text" placeholder="Search" />
      </form>
    </search>
  )
}
