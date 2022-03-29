/**
 * Add module globally icludes action and routes
 */
const SentryTracing = require("@sentry/tracing");

sentry.init({
  dsn: process.env.SENTRY_CLIENT_KEY,
  integrations: [
    // enable HTTP calls tracing
    new sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new SentryTracing.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
app.use(sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(sentry.Handlers.tracingHandler());
