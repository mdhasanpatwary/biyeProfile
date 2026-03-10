import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://574a66ee7178c2365bfeb3b9383be384@o4511018751950848.ingest.us.sentry.io/4511018753785856",

  // Capture 10% of traces in production, 100% in development
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  debug: false,
})
