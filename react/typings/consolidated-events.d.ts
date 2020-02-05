declare module 'consolidated-events' {
  export const addEventListener: <K extends keyof DocumentEventMap>(
    element: HTMLElement | Document | Window,
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => () => void
}
