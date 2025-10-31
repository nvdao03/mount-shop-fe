import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '../src/contexts/app.context.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <Story />
            </AppProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    )
  ]
}

export default preview
