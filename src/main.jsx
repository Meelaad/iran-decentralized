import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import posthog from 'posthog-js'

const PH_KEY = import.meta.env.VITE_POSTHOG_KEY
const PH_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

if (PH_KEY) {
  posthog.init(PH_KEY, { api_host: PH_HOST, autocapture: true })

  const trackPageview = () => posthog.capture('$pageview', {
    path: window.location.pathname + window.location.search,
    referrer: document.referrer,
    href: window.location.href,
  })

  // initial pageview
  trackPageview()

  // capture SPA navigations
  ;['pushState', 'replaceState'].forEach((fn) => {
    const orig = history[fn]
    history[fn] = function (...args) {
      orig.apply(this, args)
      trackPageview()
    }
  })
  window.addEventListener('popstate', trackPageview)

  // basic click tracking for links/buttons or elements with data-track-click
  document.addEventListener('click', (e) => {
    const target = e.target.closest && e.target.closest('a, button, [data-track-click]')
    if (!target) return
    posthog.capture('click', {
      tagName: target.tagName,
      href: target.href || null,
      text: (target.textContent || '').trim().slice(0, 200),
      classes: target.className || null,
    })
  })
} else {
  // eslint-disable-next-line no-console
  console.warn('PostHog not initialized: set VITE_POSTHOG_KEY in .env')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
