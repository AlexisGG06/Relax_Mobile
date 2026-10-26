import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { nombreMetodo, TIPOS_PAGO, usePagos, type MetodoPago, type TipoPago } from '../context/PagosContext';

type Props = { seleccionado?: string; onSeleccionar?: (metodo: MetodoPago) => void };

export function MetodosPago({ seleccionado, onSeleccionar }: Props) {
  const { metodos, agregarMetodo, error: errorCarga } = usePagos();
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipo, setTipo] = useState<TipoPago>('credito');
  const [titular, setTitular] = useState('');
  const [ultimos4, setUltimos4] = useState('');
  const [error, setError] = useState('');
  const esTarjeta = tipo === 'credito' || tipo === 'debito';

  async function guardar() {
    if (esTarjeta && (!titular.trim() || !/^\d{4}$/.test(ultimos4))) {
      setError('Escribe el nombre del titular y los últimos 4 dígitos.');
      return;
    }
    setGuardando(true);
    try {
    const metodo = await agregarMetodo(esTarjeta
      ? { tipo, titular: titular.trim(), ultimos4 }
      : { tipo });
    onSeleccionar?.(metodo);
    setMostrarFormulario(false);
    setTitular('');
    setUltimos4('');
    setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); }
    finally { setGuardando(false); }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.titulo}>Métodos de pago</Text>
      <Text style={styles.ayuda}>Tus métodos se guardan en tu cuenta. Las tarjetas son de prueba y no se realizan cobros.</Text>
      {!!errorCarga && <Text accessibilityRole="alert" style={styles.error}>{errorCarga}</Text>}
      {metodos.length === 0 && <Text style={styles.ayuda}>Todavía no has agregado métodos de pago.</Text>}
      {metodos.map((metodo) => (
        <Pressable key={metodo.id} disabled={!onSeleccionar}
          accessibilityRole={onSeleccionar ? 'radio' : undefined}
          accessibilityState={onSeleccionar ? { checked: seleccionado === metodo.id } : undefined}
          onPress={() => onSeleccionar?.(metodo)}
          style={[styles.opcion, seleccionado === metodo.id && styles.activo]}>
          <Text style={styles.texto}>{onSeleccionar ? (seleccionado === metodo.id ? '◉ ' : '○ ') : ''}{nombreMetodo(metodo)}</Text>
          {metodo.titular && <Text style={styles.ayuda}>{metodo.titular}</Text>}
        </Pressable>
      ))}
      {!mostrarFormulario ? (
        <Pressable accessibilityRole="button" style={styles.boton} onPress={() => setMostrarFormulario(true)}>
          <Text style={styles.botonTexto}>+ Agregar método de pago</Text>
        </Pressable>
      ) : (
        <View style={styles.formulario}>
          <Text style={styles.texto}>Elige un método</Text>
          {(Object.keys(TIPOS_PAGO) as TipoPago[]).map((opcion) => (
            <Pressable key={opcion} accessibilityRole="radio" accessibilityState={{ checked: tipo === opcion }}
              style={[styles.opcion, tipo === opcion && styles.activo]}
              onPress={() => { setTipo(opcion); setError(''); }}>
              <Text style={styles.texto}>{tipo === opcion ? '◉ ' : '○ '}{TIPOS_PAGO[opcion]}</Text>
            </Pressable>
          ))}
          {esTarjeta && <>
            <Text style={styles.ayuda}>Agrega una tarjeta de prueba usando solo su titular y terminación.</Text>
            <Text style={styles.texto}>Nombre del titular</Text>
            <TextInput accessibilityLabel="Nombre del titular" placeholder="Nombre del titular" value={titular}
              maxLength={80} autoCapitalize="words" onChangeText={setTitular} style={styles.input} />
            <Text style={styles.texto}>Últimos 4 dígitos</Text>
            <TextInput accessibilityLabel="Últimos 4 dígitos" placeholder="1234" value={ultimos4}
              keyboardType="number-pad" maxLength={4} autoComplete="off"
              onChangeText={(valor) => setUltimos4(valor.replace(/\D/g, '').slice(0, 4))} style={styles.input} />
          </>}
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" disabled={guardando} style={styles.boton} onPress={() => { void guardar(); }}>
            <Text style={styles.botonTexto}>{guardando ? 'Guardando…' : 'Guardar método'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.opcion} onPress={() => { setMostrarFormulario(false); setError(''); setTitular(''); setUltimos4(''); }}>
            <Text style={styles.texto}>Cancelar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export const estilosPago = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 16 },
  ventana: { backgroundColor: '#F5F9F8', borderRadius: 20, padding: 16, maxHeight: '90%', width: '100%', maxWidth: 560, alignSelf: 'center' },
  titulo: { fontSize: 23, fontWeight: '700', color: '#087F8C', marginBottom: 12 },
  texto: { color: '#203438', fontSize: 16, marginVertical: 10 },
  boton: { backgroundColor: '#087F8C', borderRadius: 12, padding: 16, marginTop: 10, alignItems: 'center' },
  botonTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});

const styles = StyleSheet.create({
  panel: { padding: 18, borderRadius: 18, backgroundColor: '#FFFFFF', gap: 12, marginVertical: 16 },
  titulo: { color: '#087F8C', fontSize: 22, fontWeight: '700' },
  texto: { color: '#203438', fontSize: 16, fontWeight: '600' },
  ayuda: { color: '#526763', fontSize: 14, lineHeight: 21 },
  opcion: { padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#D5E2DF', minHeight: 48, gap: 4 },
  activo: { backgroundColor: '#E3F4F1', borderColor: '#087F8C' },
  formulario: { gap: 12 },
  input: { borderWidth: 1, borderColor: '#AABFBA', padding: 14, borderRadius: 10, fontSize: 16, color: '#203438', backgroundColor: '#FFFFFF' },
  boton: { backgroundColor: '#087F8C', padding: 16, borderRadius: 10, alignItems: 'center' },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  error: { color: '#B42318', fontSize: 14 },
});
