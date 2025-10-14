import Footer from '../../components/Footer'
import Header from '../../components/Header'

interface PropTypes {
  children: React.ReactNode
}

export default function MainLayout({ children }: PropTypes) {
  return (
    <div className='bg-[#F5F5FA]'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
