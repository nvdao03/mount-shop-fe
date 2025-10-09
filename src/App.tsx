import { ToastContainer } from 'react-toastify'
import './index.css'
import useRouterElements from './useRouterElements'

function App() {
  const routerElement = useRouterElements()

  return (
    <>
      {routerElement}
      <ToastContainer />
    </>
  )
}

export default App
