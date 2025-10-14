import { useEffect, useState } from 'react'

export default function useDebounce<T>(key: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(key)

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedValue(key)
    }, delay)

    return () => clearTimeout(handle)
  }, [key, delay])

  return debouncedValue
}
