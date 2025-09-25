interface PropTypes {
  children: React.ReactNode
}

export default function AuthLayout({ children }: PropTypes) {
  return <div>{children}</div>
}
