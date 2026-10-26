import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSesion } from '../context/SesionContext';
import { api } from '../services/api';

export default function IniciarSesionScreen() {
  const router = useRouter();
  const { login } = useSesion();
  const [enviando, setEnviando] = useState(false);
  const { width } = useWindowDimensions();
  const escritorio = width >= 850;
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const passwordRef = useRef<TextInput>(null);

  function cambiarModo(crearCuenta: boolean) {
    setRegistro(crearCuenta);
    setContrasena('');
    setConfirmacion('');
    setMostrar(false);
    setError('');
    setMensaje('');
  }

  async function crearCuenta() {
    setMensaje('');
    if (nombre.trim().length < 2) { setError('Escribe tu nombre completo.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) { setError('Escribe un correo electrónico válido.'); return; }
    if (telefono && !/^\+?[\d\s()-]{7,20}$/.test(telefono.trim())) { setError('Revisa tu número de teléfono.'); return; }
    if (contrasena.length < 8 || contrasena.length > 72) { setError('La contraseña debe tener entre 8 y 72 caracteres.'); return; }
    if (contrasena !== confirmacion) { setError('Las contraseñas no coinciden.'); return; }
    setEnviando(true);
    try {
      await api('registro', { nombre, correo, telefono, contrasena });
      try {
        await login(correo.trim().toLowerCase(), contrasena);
      } catch {
        cambiarModo(false);
        setMensaje('Cuenta creada exitosamente');
        setError('No se pudo iniciar sesión automáticamente. Ingresa tus credenciales para continuar.');
        return;
      }
      setContrasena('');
      setConfirmacion('');
      router.replace({ pathname: '/', params: { cuentaCreada: '1' } });
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta.'); }
    finally { setEnviando(false); }
  }

  async function iniciarSesion() {
    setMensaje('');
    const email = correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }
    if (!contrasena) {
      setError('Escribe tu contraseña.');
      passwordRef.current?.focus();
      return;
    }
    setEnviando(true);
    try {
      const cuenta = await login(email, contrasena);
      setError(''); setContrasena('');
      if (cuenta.rol === 'cliente') router.replace('/');
      else setMensaje(`Sesión iniciada como ${cuenta.rol}. Tu pantalla de inicio todavía no está disponible.`);
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.'); }
    finally { setEnviando(false); }
  }

  return (
    <SafeAreaView style={s.pagina}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
          <View style={s.header}>
            <View><Text style={s.logo}>RELAX</Text><Text style={s.subtitulo}>Descubre Hidalgo</Text></View>
            <Pressable accessibilityRole="button" style={s.volver} onPress={() => router.replace('/')}>
              <Text style={s.enlace}>← Volver al inicio</Text>
            </Pressable>
          </View>
          <View style={[s.contenido, escritorio && s.columnas]}>
            <View style={[s.presentacion, escritorio && s.flex]}>
              <Text style={s.etiqueta}>TU PRÓXIMA EXPERIENCIA</Text>
              <Text accessibilityRole="header" style={[s.titulo, escritorio && s.tituloAmplio]}>Todo comienza con un buen viaje.</Text>
              <Text style={s.descripcion}>Un solo lugar para descubrir Hidalgo y conectar con nuevas experiencias.</Text>
              <View style={s.destino}>
                <Text style={s.montana}>⛰</Text>
                <View style={s.flex}><Text style={s.destinoTitulo}>Cerca de ti, lejos de la rutina</Text><Text style={s.descripcion}>Naturaleza, cultura y momentos para recordar.</Text></View>
              </View>
              <Text style={s.pie}>Huasca de Ocampo · Real del Monte · Mineral del Chico</Text>
            </View>
            <View style={s.tarjeta}>
              <Text style={s.etiqueta}>BIENVENIDO A RELAX</Text>
              <View style={s.pestanas}>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: !registro }} style={[s.pestana, !registro && s.pestanaActiva]} onPress={() => cambiarModo(false)}>
                  <Text style={s.enlace}>Iniciar sesión</Text>
                </Pressable>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: registro }} style={[s.pestana, registro && s.pestanaActiva]} onPress={() => cambiarModo(true)}>
                  <Text style={s.enlace}>Crear cuenta</Text>
                </Pressable>
              </View>
              <Text accessibilityRole="header" style={s.tituloFormulario}>{registro ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
              <Text style={s.descripcion}>{registro ? 'Empieza tu experiencia en RELAX.' : 'Ingresa tus credenciales para continuar.'}</Text>
              {registro && <>
                <Text style={s.ayuda}>Registro exclusivo para clientes. Las cuentas de empresa las da de alta el administrador.</Text>
                <Text style={s.label}>Nombre completo</Text>
                <TextInput accessibilityLabel="Nombre completo" value={nombre} onChangeText={(valor) => { setNombre(valor); setError(''); setMensaje(''); }}
                  placeholder="Tu nombre completo" placeholderTextColor="#748589" autoComplete="name" autoCapitalize="words" maxLength={120} style={s.input} />
                <Text style={s.label}>Teléfono (opcional)</Text>
                <TextInput accessibilityLabel="Teléfono opcional" value={telefono} onChangeText={(valor) => { setTelefono(valor); setError(''); setMensaje(''); }}
                  placeholder="Número de contacto" placeholderTextColor="#748589" keyboardType="phone-pad" autoComplete="tel" maxLength={20} style={s.input} />
              </>}
              <Text style={s.label}>Correo electrónico</Text>
              <TextInput accessibilityLabel="Correo electrónico" placeholder="tu@correo.com" placeholderTextColor="#748589"
                value={correo} onChangeText={(valor) => { setCorreo(valor); setError(''); setMensaje(''); }}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email"
                returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} style={s.input} />
              <Text style={s.label}>Contraseña</Text>
              <View style={s.password}>
                <TextInput ref={passwordRef} accessibilityLabel="Contraseña" placeholder="Escribe tu contraseña" placeholderTextColor="#748589"
                  value={contrasena} secureTextEntry={!mostrar} autoCapitalize="none" autoCorrect={false} autoComplete={registro ? 'new-password' : 'current-password'}
                  onChangeText={(valor) => { setContrasena(valor); setError(''); setMensaje(''); }} returnKeyType="go" onSubmitEditing={registro ? crearCuenta : iniciarSesion} style={s.passwordInput} />
                <Pressable accessibilityRole="button" accessibilityLabel={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={s.mostrar} onPress={() => setMostrar((actual) => !actual)}><Text style={s.enlace}>{mostrar ? 'Ocultar' : 'Mostrar'}</Text></Pressable>
              </View>
              {registro && <>
                <Text style={s.ayuda}>Usa al menos 8 caracteres.</Text>
                <Text style={s.label}>Confirmar contraseña</Text>
                <TextInput accessibilityLabel="Confirmar contraseña" value={confirmacion} onChangeText={(valor) => { setConfirmacion(valor); setError(''); setMensaje(''); }}
                  placeholder="Repite tu contraseña" placeholderTextColor="#748589" secureTextEntry={!mostrar} autoCapitalize="none" autoCorrect={false}
                  autoComplete="new-password" returnKeyType="go" onSubmitEditing={crearCuenta} style={s.input} />
              </>}
              {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
              {!!mensaje && <Text accessibilityRole="alert" style={s.exito}>{mensaje}</Text>}
              <Pressable accessibilityRole="button" disabled={enviando} style={({ pressed }) => [s.boton, (pressed || enviando) && { opacity: 0.8 }]} onPress={() => { void (registro ? crearCuenta() : iniciarSesion()); }}>
                <Text style={s.botonTexto}>{enviando ? 'Procesando…' : registro ? 'Crear cuenta →' : 'Iniciar sesión →'}</Text>
              </Pressable>
              <View style={s.demo}>
                <Text style={s.demoTitulo}>{registro ? 'Tu cuenta RELAX' : 'Acceso a tu cuenta'}</Text>
                <Text style={s.ayuda}>{registro ? 'El registro público desde la página principal crea únicamente cuentas de cliente.' : 'Ingresa el correo y la contraseña de tu cuenta. El sistema identifica tu rol.'}</Text>
              </View>
            </View>
          </View>
          <Text style={s.footer}>RELAX · Descubre, conecta y disfruta.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: '#F5F9F8' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  header: { width: '100%', maxWidth: 1050, alignSelf: 'center', paddingVertical: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  logo: { fontSize: 27, fontWeight: '900', letterSpacing: 4, color: '#087F8C' },
  subtitulo: { color: '#748589', fontSize: 12, marginTop: 2 },
  volver: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  enlace: { color: '#087F8C', fontWeight: '700', fontSize: 13 },
  contenido: { width: '100%', maxWidth: 1050, alignSelf: 'center', gap: 24, marginVertical: 12 },
  columnas: { flexDirection: 'row', alignItems: 'center', gap: 48, flex: 1 },
  presentacion: { gap: 18, paddingVertical: 16 },
  etiqueta: { color: '#087F8C', fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  titulo: { color: '#203438', fontSize: 34, lineHeight: 42, fontWeight: '900' },
  tituloAmplio: { fontSize: 46, lineHeight: 55 },
  descripcion: { color: '#637976', fontSize: 15, lineHeight: 23 },
  destino: { backgroundColor: '#E5F3EF', borderRadius: 22, padding: 20, flexDirection: 'row', gap: 16, alignItems: 'center' },
  montana: { color: '#087F8C', fontSize: 42 },
  destinoTitulo: { color: '#203438', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  pie: { color: '#748589', fontSize: 12, lineHeight: 20 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, width: '100%', maxWidth: 480, alignSelf: 'center', flexShrink: 1 },
  tituloFormulario: { color: '#203438', fontSize: 29, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  label: { color: '#203438', fontSize: 14, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  pestanas: { flexDirection: 'row', gap: 8, marginTop: 14 },
  pestana: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DFE9E6', borderRadius: 12 },
  pestanaActiva: { backgroundColor: '#E5F3EF', borderColor: '#087F8C' },
  ayuda: { color: '#637976', fontSize: 12, lineHeight: 19, marginTop: 5 },
  input: { minHeight: 52, borderWidth: 1, borderColor: '#DFE9E6', borderRadius: 13, paddingHorizontal: 14, backgroundColor: '#F8FBFA', color: '#203438', fontSize: 15 },
  password: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DFE9E6', borderRadius: 13, backgroundColor: '#F8FBFA' },
  passwordInput: { flex: 1, minWidth: 0, minHeight: 52, paddingHorizontal: 14, color: '#203438', fontSize: 15 },
  mostrar: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  error: { color: '#B42318', fontSize: 13, lineHeight: 20, marginTop: 12 },
  exito: { color: '#087F8C', backgroundColor: '#E5F3EF', padding: 14, borderRadius: 12, fontSize: 14, lineHeight: 21, marginTop: 14 },
  boton: { backgroundColor: '#087F8C', borderRadius: 14, minHeight: 54, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  demo: { borderTopWidth: 1, borderTopColor: '#E8EFEC', marginTop: 24, paddingTop: 16 },
  demoTitulo: { color: '#637976', fontSize: 12, fontWeight: '700' },
  footer: { color: '#748589', textAlign: 'center', fontSize: 12, marginTop: 20 },
});
