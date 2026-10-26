import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { HospedajeCatalogo } from '../data/hospedajes';
import type { ZonaTuristica } from '../data/zonas';
import { api, assetUrl } from '../services/api';

type Catalogos = { hospedajes: HospedajeCatalogo[]; zonas: ZonaTuristica[] };
const Context = createContext<Catalogos | null>(null);
export function CatalogosProvider({ children }: { children: ReactNode }) {
  const [catalogos, setCatalogos] = useState<Catalogos | null>(null);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    let activo = true;
    api<Catalogos>('catalogos').then((r) => {
      for (const zona of r.zonas) for (const item of [...zona.actividades, ...zona.restaurantes]) {
        if (item.imagen?.uri) item.imagen.uri = assetUrl(item.imagen.uri);
      }
      if (activo) { setCatalogos(r); setError(''); }
    }).catch((e: Error) => { if (activo) setError(e.message); });
    return () => { activo = false; };
  }, [intento]);
  if (!catalogos) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F9F8', padding: 24, gap: 16 }}>
    {error ? <><Text>{error}</Text><Pressable accessibilityRole="button" onPress={() => setIntento((n) => n + 1)}><Text>Reintentar conexión</Text></Pressable></> : <><ActivityIndicator color="#087F8C" /><Text>Cargando RELAX…</Text></>}
  </View>;
  return <Context.Provider value={catalogos}>{children}</Context.Provider>;
}
export function useCatalogos() { const c = useContext(Context); if (!c) throw new Error('Falta CatalogosProvider'); return c; }
