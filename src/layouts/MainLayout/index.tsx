import Header from '../../components/Header'

interface PropTypes {
  children: React.ReactNode
}

export default function MainLayout({ children }: PropTypes) {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-7'>
      <Header />
      {children}
    </div>
  )
}
