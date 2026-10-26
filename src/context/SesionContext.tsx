import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, apiGeneration, setApiToken } from '../services/api';

export type Usuario = { id: number; nombre: string; correo: string; telefono: string | null; rol: 'cliente' | 'administrador' | 'empresario' };
const SesionContext = createContext<{
  usuario: Usuario | null; lista: boolean; error: string;
  login: (correo: string, contrasena: string) => Promise<Usuario>;
  logout: () => Promise<void>;
} | null>(null);
export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [lista, setLista] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let activo = true;
    const inicio = apiGeneration();
    api<{ usuario: Usuario | null }>('sesion').then((r) => { if (activo && inicio === apiGeneration()) setUsuario(r.usuario); })
      .catch((e: Error) => { if (activo) setError(e.message); }).finally(() => { if (activo) setLista(true); });
    return () => { activo = false; };
  }, []);
  async function login(correo: string, contrasena: string) {
    const r = await api<{ usuario: Usuario; token: string }>('login', { correo, contrasena });
    setApiToken(r.token); setUsuario(r.usuario); setError(''); return r.usuario;
  }
  async function logout() { await api('logout', {}); setApiToken(null); setUsuario(null); }
  return <SesionContext.Provider value={{ usuario, lista, error, login, logout }}>{children}</SesionContext.Provider>;
}
export function useSesion() { const value = useContext(SesionContext); if (!value) throw new Error('Falta SesionProvider'); return value; }
