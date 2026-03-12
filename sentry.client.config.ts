import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of traces in production, 100% in development
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Replay 1% of sessions, 100% if there's an error
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  debug: false,

  integrations: [
    Sentry.replayIntegration(),
  ],
})
