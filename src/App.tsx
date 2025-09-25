import './index.css'
import useRouterElements from './useRouterElements'

function App() {
  const routerElement = useRouterElements()

  return <>{routerElement}</>
}

export default App
