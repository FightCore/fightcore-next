import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://373aec30d96a935aec1a26d7980eabd5@o4507902200119296.ingest.de.sentry.io/4507902211194960",
  tunnel: 'https://sentry.fightcore.gg',
  // Replay may only be enabled for the client-side
  integrations: [Sentry.replayIntegration()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
