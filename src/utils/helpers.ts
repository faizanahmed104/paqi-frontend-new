import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import {
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  OctagonAlert,
  Skull,
} from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function aqiInfo(aqiNum?: number | null) {
  const aqi = typeof aqiNum === 'number' ? aqiNum : -1;
  if (aqi >= 0 && aqi <= 50)
    return { status: 'Good', Icon: Smile, color: '#56AF7E' };
  if (aqi <= 100) return { status: 'Moderate', Icon: Meh, color: '#DDAE5B' };
  if (aqi <= 150) return { status: 'USG', Icon: Frown, color: '#E97E3C' };
  if (aqi <= 200)
    return { status: 'Unhealthy', Icon: AlertTriangle, color: '#CA5C58' };
  if (aqi <= 300)
    return { status: 'Very Unhealthy', Icon: OctagonAlert, color: '#A070B6' };
  if (aqi > 300) return { status: 'Hazardous', Icon: Skull, color: '#A52A2A' };
  return { status: '—', Icon: Meh, color: '#9CA3AF' };
}

export function getAqius(resp: any): number | null {
  return resp?.data?.current?.pollution?.aqius ?? null;
}