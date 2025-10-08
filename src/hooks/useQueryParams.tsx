import { useSearchParams } from 'react-router-dom'

function useQueryParams() {
  const [searchParams] = useSearchParams()
  const result = Object.fromEntries(searchParams.entries())
  return result
}

export default useQueryParams
