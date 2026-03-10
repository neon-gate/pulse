interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Main(props: MainProps) {
  return <main {...props} />
}
