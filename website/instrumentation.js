import * as Sentry from "@sentry/nextjs";

export async function register() {
}

export const onRequestError = Sentry.captureRequestError;
