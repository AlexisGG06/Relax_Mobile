import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { api, apiGeneration } from '../services/api';
import { useSesion } from './SesionContext';

export type Hospedaje = { id?: string; nombre: string; ubicacion: string; precio: string; calificacion?: string; fechaLlegada?: string; fechaSalida?: string; huespedes?: number; metodoPago?: string; metodoPagoId?: string };
export type Actividad = { nombre: string; ubicacion: string; duracion: string; tipo: string; precio: number; personas: number; fecha: string };
export type Restaurante = { nombre: string; ubicacion: string; tipo: string; calificacion?: string; fecha: string };
export type Lugar = { nombre: string; ubicacion: string; tipo: string; descripcion?: string; fecha?: string };
type Estado = { hospedaje: Hospedaje | null; actividades: Actividad[]; restaurantes: Restaurante[]; lugares: Lugar[]; favoritosActividades: string[]; favoritosRestaurantes: string[] };
const VACIO: Estado = { hospedaje: null, actividades: [], restaurantes: [], lugares: [], favoritosActividades: [], favoritosRestaurantes: [] };
type Contexto = Estado & {
  reservarHospedaje: (h: Hospedaje) => Promise<void>;
  eliminarHospedaje: () => void;
  agregarActividad: (a: Actividad) => void; eliminarActividad: (nombre: string) => void;
  agregarRestaurante: (r: Restaurante) => void; eliminarRestaurante: (nombre: string) => void;
  agregarLugar: (l: Lugar) => void; eliminarLugar: (nombre: string) => void;
  toggleFavoritoActividad: (nombre: string) => void; toggleFavoritoRestaurante: (nombre: string) => void;
};
const ViajeContext = createContext<Contexto | null>(null);
export function ViajeProvider({ children }: { children: ReactNode }) {
  const { usuario } = useSesion();
  const [estado, setEstado] = useState<{ usuarioId: number; datos: Estado } | null>(null);
  const [error, setError] = useState('');
  const cola = useRef<Promise<unknown>>(Promise.resolve());
  const usuarioActual = useRef(usuario?.id);
  useEffect(() => {
    usuarioActual.current = usuario?.id;
    if (!usuario || usuario.rol !== 'cliente') return;
    let activo = true;
    api<Estado>('viaje').then((datos) => { if (activo) setEstado({ usuarioId: usuario.id, datos }); })
      .catch((e: Error) => { if (activo) setError(e.message); });
    return () => { activo = false; };
  }, [usuario]);
  const datos = usuario && estado?.usuarioId === usuario.id ? estado.datos : VACIO;
  const cargando = usuario?.rol === 'cliente' && estado?.usuarioId !== usuario.id && !error;
  function guardar(payload: object, propagar = false): Promise<void> {
    if (!usuario || usuario.rol !== 'cliente') {
      const e = new Error('Inicia sesión con una cuenta de cliente para guardar tu viaje.'); setError(e.message);
      return propagar ? Promise.reject(e) : Promise.resolve();
    }
    const uid = usuario.id;
    const generacion = apiGeneration();
    const tarea = cola.current.catch(() => {}).then(async () => {
      if (usuarioActual.current !== uid || generacion !== apiGeneration()) throw new Error('La sesión cambió. Intenta de nuevo.');
      const datos = await api<Estado>('viaje', payload);
      if (usuarioActual.current === uid) { setEstado({ usuarioId: uid, datos }); setError(''); }
    });
    cola.current = tarea;
    return tarea.catch((e: Error) => { if (usuarioActual.current === uid) setError(e.message); if (propagar) throw e; });
  }
  return <ViajeContext.Provider value={{ ...datos,
    reservarHospedaje: (elemento) => guardar({ operacion: 'reservar', elemento }, true),
    eliminarHospedaje: () => { void guardar({ operacion: 'eliminarHospedaje' }); },
    agregarActividad: (elemento) => { void guardar({ operacion: 'agregar', tipo: 'actividad', elemento }); },
    eliminarActividad: (nombre) => { void guardar({ operacion: 'eliminar', tipo: 'actividad', nombre }); },
    agregarRestaurante: (elemento) => { void guardar({ operacion: 'agregar', tipo: 'restaurante', elemento }); },
    eliminarRestaurante: (nombre) => { void guardar({ operacion: 'eliminar', tipo: 'restaurante', nombre }); },
    agregarLugar: (elemento) => { void guardar({ operacion: 'agregar', tipo: 'lugar', elemento }); },
    eliminarLugar: (nombre) => { void guardar({ operacion: 'eliminar', tipo: 'lugar', nombre }); },
    toggleFavoritoActividad: (nombre) => { void guardar({ operacion: 'favorito', tipo: 'actividad', nombre }); },
    toggleFavoritoRestaurante: (nombre) => { void guardar({ operacion: 'favorito', tipo: 'restaurante', nombre }); },
  }}>
    {!!error && <View style={{ padding: 14, backgroundColor: '#FFF0EB' }}><Text accessibilityRole="alert">{error}</Text>{!usuario && <Link href="/iniciar-sesion">Iniciar sesión</Link>}</View>}
    {cargando ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color="#087F8C" /><Text>Recuperando tu viaje…</Text></View> : children}
  </ViajeContext.Provider>;
}
export function useViaje() { const c = useContext(ViajeContext); if (!c) throw new Error('Falta ViajeProvider'); return c; }
