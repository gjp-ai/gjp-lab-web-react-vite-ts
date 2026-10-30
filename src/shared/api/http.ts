import ky from 'ky';

// API paths are independent of the SPA hosting prefix. No backend is supplied by this app.
export const api = ky.create({ baseUrl: '/api/', timeout: 10_000, retry: 0 });
