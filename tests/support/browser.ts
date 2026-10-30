import { jest } from '@jest/globals';

// Model only the browser boundary; application components and Base UI remain real.
export function browserEnvironment(desktop = true, dark = false) {
  const queries = new Map<string, MediaQueryList>();
  const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => {
      let media = queries.get(query);
      if (!media) {
        const events = new EventTarget();
        media = {
          matches: query.includes('min-width') ? desktop : dark,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: events.addEventListener.bind(events),
          removeEventListener: events.removeEventListener.bind(events),
          dispatchEvent: events.dispatchEvent.bind(events),
        };
        queries.set(query, media);
      }
      return media;
    },
  });
  const scroll = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  return {
    change(query: string, matches: boolean) {
      const media = window.matchMedia(query);
      Object.defineProperty(media, 'matches', { configurable: true, value: matches });
      media.dispatchEvent(new Event('change'));
    },
    restore() {
      scroll.mockRestore();
      if (original) Object.defineProperty(window, 'matchMedia', original);
      else Reflect.deleteProperty(window, 'matchMedia');
    },
  };
}
