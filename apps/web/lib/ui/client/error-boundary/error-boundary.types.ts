export interface NextPageErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}
