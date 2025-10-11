import Header from '../../components/Header'

interface PropTypes {
  children: React.ReactNode
}

export default function MainLayout({ children }: PropTypes) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
