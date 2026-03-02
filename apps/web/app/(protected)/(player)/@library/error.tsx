'use client'

import { Button } from '@base-ui/react/button'
import type { NextPageErrorProps } from '@lib/ui/client'

export default function LibraryError(props: NextPageErrorProps) {
  const { error, reset } = props

  function handleReset() {
    reset()
  }

  return (
    <div>
      <h2>Library failed to load.</h2>
      <p>{error.message}</p>
      <Button type="button" onClick={handleReset}>
        Try again
      </Button>
    </div>
  )
}
