interface PropTypes {
  children: React.ReactNode
}

export default function MainLayout({ children }: PropTypes) {
  return <div>{children}</div>
}
