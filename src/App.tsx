import { ToastContainer } from 'react-toastify'
import './index.css'
import useRouterElements from './useRouterElements'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const routerElement = useRouterElements()

  return (
    <>
      <ScrollToTop />
      {routerElement}
      <ToastContainer />
    </>
  )
}

export default App
