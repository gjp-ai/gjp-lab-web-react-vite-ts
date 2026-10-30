import { setupWorker } from 'msw/browser';

// Feature handlers can be composed here when API-backed pages are introduced.
export const worker = setupWorker();
