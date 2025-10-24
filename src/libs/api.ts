export const BASE_URL = 'https://api.airvisual.com/v2/city';
export const API_KEY = process.env.NEXT_PUBLIC_AIRVISUAL_KEY || '';
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export const controller = new AbortController();
export const buildUrl = (c: any, key: string) =>
  `${BASE_URL}?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state)}&country=${encodeURIComponent(
    c.country
  )}&key=${encodeURIComponent(key)}`;