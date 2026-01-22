export function createEvent(eventName: string, props: unknown): void {
  try {
    //@ts-ignore
    umami.track(eventName, props);
  } catch {
    // Ignored
  }
}
