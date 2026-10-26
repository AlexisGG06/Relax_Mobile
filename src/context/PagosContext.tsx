import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../services/api';
import { useSesion } from './SesionContext';
export const TIPOS_PAGO = { credito: 'Tarjeta de crédito', debito: 'Tarjeta de débito', efectivo: 'Efectivo al llegar', transferencia: 'Transferencia bancaria', oxxo: 'Pago en OXXO' } as const;
export type TipoPago = keyof typeof TIPOS_PAGO;
export type MetodoPago = { id: string; tipo: TipoPago; titular?: string; ultimos4?: string };
export type NuevoMetodoPago = Omit<MetodoPago, 'id'>;
export function nombreMetodo(m: MetodoPago) { return `${TIPOS_PAGO[m.tipo]}${m.ultimos4 ? ` •••• ${m.ultimos4}` : ''}`; }
const Context = createContext<{ metodos: MetodoPago[]; error: string; agregarMetodo: (m: NuevoMetodoPago) => Promise<MetodoPago> } | null>(null);
export function PagosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useSesion();
  const [datos, setDatos] = useState<{ usuarioId: number; metodos: MetodoPago[] } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!usuario || usuario.rol !== 'cliente') return;
    let activo = true;
    api<{ metodos: MetodoPago[] }>('metodos').then((r) => { if (activo) { setDatos({ usuarioId: usuario.id, metodos: r.metodos }); setError(''); } })
      .catch((e: Error) => { if (activo) setError(e.message); });
    return () => { activo = false; };
  }, [usuario]);
  async function agregarMetodo(m: NuevoMetodoPago) {
    if (!usuario || usuario.rol !== 'cliente') throw new Error('Inicia sesión como cliente para guardar métodos de pago.');
    const r = await api<{ metodo: MetodoPago; metodos: MetodoPago[] }>('metodos', m);
    setDatos({ usuarioId: usuario.id, metodos: r.metodos }); setError(''); return r.metodo;
  }
  return <Context.Provider value={{ metodos: usuario && datos?.usuarioId === usuario.id ? datos.metodos : [], error, agregarMetodo }}>{children}</Context.Provider>;
}
export function usePagos() { const c = useContext(Context); if (!c) throw new Error('Falta PagosProvider'); return c; }
