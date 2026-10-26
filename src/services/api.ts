import { Platform } from 'react-native';

let token: string | null = null;
let generation = 0;
export function setApiToken(value: string | null) { token = value; generation++; }
export function apiGeneration() { return generation; }
export function apiOrigin() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  if (Platform.OS === 'web' && typeof window !== 'undefined') return `${window.location.protocol}//${window.location.hostname}/RELAX-Mobile/api`;
  return 'http://localhost/RELAX-Mobile/api';
}
export function assetUrl(uri: string) {
  return uri.startsWith('/') ? new URL(uri, apiOrigin()).href : uri;
}
export async function api<T>(action: string, data?: object): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiOrigin()}/index.php?accion=${encodeURIComponent(action)}`, {
      method: data ? 'POST' : 'GET', credentials: 'include',
      headers: { ...(data ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  } catch { throw new Error('No se pudo conectar con XAMPP. Comprueba Apache y MariaDB.'); }
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || 'No se pudo completar la operación.');
  return value as T;
}
