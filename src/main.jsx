import './i18n';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'posthog-js/dist/posthog-recorder'
import { PostHogProvider } from '@posthog/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-03-11',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </PostHogProvider>
  </StrictMode>,
)
