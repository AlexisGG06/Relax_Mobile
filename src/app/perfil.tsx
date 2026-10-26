import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { MetodosPago } from '../components/metodos-pago';
import { useSesion } from '../context/SesionContext';
import { useState } from 'react';

export default function PerfilScreen() {
  const { usuario, logout } = useSesion();
  const [errorSesion, setErrorSesion] = useState('');
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scroll
        }
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              RELAX
            </Text>

            <Text
              style={styles.subtitulo}
            >
              Tu espacio personal
            </Text>
          </View>
        </View>

        {/* =====================================
            PRESENTACIÓN
        ===================================== */}

        <View
          style={styles.presentacion}
        >
          <Text
            style={styles.etiqueta}
          >
            TU PERFIL
          </Text>

          <Text style={styles.titulo}>
            Perfil
          </Text>

          <Text
            style={
              styles.descripcionPagina
            }
          >
            Consulta la información de tu
            cuenta y accede rápidamente a
            las principales opciones de
            RELAX.
          </Text>
        </View>

        {/* =====================================
            TARJETA PERFIL
        ===================================== */}

        <View
          style={[
            styles.perfilCard,

            esMovil &&
              styles.perfilCardMovil,
          ]}
        >
          <View
            style={styles.avatarCaja}
          >
            <Text
              style={styles.avatarEmoji}
            >
              👤
            </Text>
          </View>

          <View
            style={
              styles.perfilInfo
            }
          >
            <Text
              style={
                styles.perfilEtiqueta
              }
            >
              VIAJERO RELAX
            </Text>

            <Text
              style={
                styles.perfilNombre
              }
            >
              Mi perfil
            </Text>

            <Text
              style={
                styles.perfilDescripcion
              }
            >
              Organiza tus viajes,
              consulta tus reservaciones
              y guarda tus experiencias
              favoritas en Hidalgo.
            </Text>
          </View>
        </View>

        {/* =====================================
            MI CUENTA
        ===================================== */}

        <View
          style={
            styles.seccionHeader
          }
        >
          <Text
            style={
              styles.seccionTitulo
            }
          >
            Mi cuenta
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Información general de tu
            perfil
          </Text>
        </View>

        <View
          style={styles.card}
        >
          <View
            style={styles.infoFila}
          >
            <View
              style={
                styles.infoIconoCaja
              }
            >
              <Text
                style={
                  styles.infoIcono
                }
              >
                👤
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.infoEtiqueta
                }
              >
                NOMBRE
              </Text>

              <Text
                style={
                  styles.infoValor
                }
              >
                {usuario?.nombre ?? 'Invitado RELAX'}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.separador
            }
          />

          <View
            style={styles.infoFila}
          >
            <View
              style={
                styles.infoIconoCaja
              }
            >
              <Text
                style={
                  styles.infoIcono
                }
              >
                📧
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.infoEtiqueta
                }
              >
                CORREO
              </Text>

              <Text
                style={
                  styles.infoValor
                }
              >
                {usuario?.correo ?? 'Inicia sesión para ver tu cuenta'}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.separador
            }
          />

          <View
            style={styles.infoFila}
          >
            <View
              style={
                styles.infoIconoCaja
              }
            >
              <Text
                style={
                  styles.infoIcono
                }
              >
                📍
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.infoEtiqueta
                }
              >
                REGIÓN
              </Text>

              <Text
                style={
                  styles.infoValor
                }
              >
                Hidalgo, México
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity accessibilityRole="button" onPress={() => { if (usuario) { logout().catch((e: Error) => setErrorSesion(e.message)); } else router.push('/iniciar-sesion'); }}
          style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 18, marginVertical: 16 }}>
          <Text style={styles.seccionTitulo}>{usuario ? 'Cerrar sesión' : 'Iniciar sesión →'}</Text>
          <Text style={styles.seccionTexto}>{usuario ? `${usuario.nombre} · ${usuario.rol}` : 'Accede a tu cuenta o crea una cuenta de cliente.'}</Text>
          {!!errorSesion && <Text accessibilityRole="alert">{errorSesion}</Text>}
        </TouchableOpacity>

        <MetodosPago />

        {/* =====================================
            ACCESOS RÁPIDOS
        ===================================== */}

        <View
          style={
            styles.seccionHeader
          }
        >
          <Text
            style={
              styles.seccionTitulo
            }
          >
            Accesos rápidos
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Continúa organizando tu
            experiencia
          </Text>
        </View>

        <View
          style={[
            styles.accesosGrid,

            esMovil &&
              styles.accesosGridMovil,
          ]}
        >
          {/* MI VIAJE */}

          <TouchableOpacity
            style={[
              styles.accesoCard,

              esMovil &&
                styles.accesoCardMovil,
            ]}
            onPress={() =>
              router.push(
                '/mi-viaje' as any
              )
            }
          >
            <View
              style={
                styles.accesoEmojiCaja
              }
            >
              <Text
                style={
                  styles.accesoEmoji
                }
              >
                🧳
              </Text>
            </View>

            <Text
              style={
                styles.accesoTitulo
              }
            >
              Mi viaje
            </Text>

            <Text
              style={
                styles.accesoTexto
              }
            >
              Consulta tu hospedaje,
              actividades, restaurantes
              e itinerario.
            </Text>

            <Text
              style={
                styles.accesoAccion
              }
            >
              Ver viaje →
            </Text>
          </TouchableOpacity>

          {/* FAVORITOS */}

          <TouchableOpacity
            style={[
              styles.accesoCard,

              esMovil &&
                styles.accesoCardMovil,
            ]}
            onPress={() =>
              router.push(
                '/lugares' as any
              )
            }
          >
            <View
              style={
                styles.accesoEmojiCaja
              }
            >
              <Text
                style={
                  styles.accesoEmoji
                }
              >
                ❤️
              </Text>
            </View>

            <Text
              style={
                styles.accesoTitulo
              }
            >
              Favoritos
            </Text>

            <Text
              style={
                styles.accesoTexto
              }
            >
              Consulta actividades y
              restaurantes y guarda los
              que más te interesen.
            </Text>

            <Text
              style={
                styles.accesoAccion
              }
            >
              Explorar →
            </Text>
          </TouchableOpacity>

          {/* HOSPEDAJES */}

          <TouchableOpacity
            style={[
              styles.accesoCard,

              esMovil &&
                styles.accesoCardMovil,
            ]}
            onPress={() =>
              router.push(
                '/hospedajes' as any
              )
            }
          >
            <View
              style={
                styles.accesoEmojiCaja
              }
            >
              <Text
                style={
                  styles.accesoEmoji
                }
              >
                🏨
              </Text>
            </View>

            <Text
              style={
                styles.accesoTitulo
              }
            >
              Hospedajes
            </Text>

            <Text
              style={
                styles.accesoTexto
              }
            >
              Encuentra hoteles,
              posadas y cabañas para tu
              próxima visita.
            </Text>

            <Text
              style={
                styles.accesoAccion
              }
            >
              Ver opciones →
            </Text>
          </TouchableOpacity>

          {/* ASISTENTE */}

          <TouchableOpacity
            style={[
              styles.accesoCard,

              esMovil &&
                styles.accesoCardMovil,
            ]}
            onPress={() =>
              router.push(
                '/asistente' as any
              )
            }
          >
            <View
              style={
                styles.accesoEmojiCaja
              }
            >
              <Text
                style={
                  styles.accesoEmoji
                }
              >
                💬
              </Text>
            </View>

            <Text
              style={
                styles.accesoTitulo
              }
            >
              Asistente
            </Text>

            <Text
              style={
                styles.accesoTexto
              }
            >
              Recibe sugerencias rápidas
              sobre lugares, comida y
              actividades.
            </Text>

            <Text
              style={
                styles.accesoAccion
              }
            >
              Abrir asistente →
            </Text>
          </TouchableOpacity>
        </View>

        {/* =====================================
            PREFERENCIAS
        ===================================== */}

        <View
          style={
            styles.seccionHeader
          }
        >
          <Text
            style={
              styles.seccionTitulo
            }
          >
            Preferencias
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Opciones generales de la app
          </Text>
        </View>

        <View
          style={styles.card}
        >
          <TouchableOpacity
            style={styles.opcionFila}
          >
            <View
              style={
                styles.opcionIconoCaja
              }
            >
              <Text
                style={
                  styles.opcionIcono
                }
              >
                🔔
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.opcionTitulo
                }
              >
                Notificaciones
              </Text>

              <Text
                style={
                  styles.opcionTexto
                }
              >
                Avisos relacionados con
                tu viaje.
              </Text>
            </View>

            <Text
              style={styles.flecha}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.separador
            }
          />

          <TouchableOpacity
            style={styles.opcionFila}
          >
            <View
              style={
                styles.opcionIconoCaja
              }
            >
              <Text
                style={
                  styles.opcionIcono
                }
              >
                🎨
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.opcionTitulo
                }
              >
                Apariencia
              </Text>

              <Text
                style={
                  styles.opcionTexto
                }
              >
                Personaliza la apariencia
                de RELAX.
              </Text>
            </View>

            <Text
              style={styles.flecha}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.separador
            }
          />

          <TouchableOpacity
            style={styles.opcionFila}
          >
            <View
              style={
                styles.opcionIconoCaja
              }
            >
              <Text
                style={
                  styles.opcionIcono
                }
              >
                ❓
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.opcionTitulo
                }
              >
                Ayuda
              </Text>

              <Text
                style={
                  styles.opcionTexto
                }
              >
                Información sobre el uso
                de la aplicación.
              </Text>
            </View>

            <Text
              style={styles.flecha}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* =====================================
            INFO DE APP
        ===================================== */}

        <View
          style={styles.relaxCard}
        >
          <View
            style={
              styles.relaxIconoCaja
            }
          >
            <Text
              style={
                styles.relaxIcono
              }
            >
              🌄
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={
                styles.relaxTitulo
              }
            >
              RELAX
            </Text>

            <Text
              style={
                styles.relaxTexto
              }
            >
              Aplicación para descubrir y
              organizar experiencias
              turísticas en Hidalgo.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* =====================================
          NAVEGACIÓN
      ===================================== */}

      <View
        style={styles.bottomNav}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.replace(
              '/' as any
            )
          }
        >
          <Text
            style={styles.navEmoji}
          >
            🏠
          </Text>

          <Text
            style={styles.navTexto}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.replace(
              '/explorar' as any
            )
          }
        >
          <Text
            style={styles.navEmoji}
          >
            🔍
          </Text>

          <Text
            style={styles.navTexto}
          >
            Explorar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.replace(
              '/mi-viaje' as any
            )
          }
        >
          <Text
            style={styles.navEmoji}
          >
            🧳
          </Text>

          <Text
            style={styles.navTexto}
          >
            Mi viaje
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navEmoji,
              styles.navActivo,
            ]}
          >
            👤
          </Text>

          <Text
            style={[
              styles.navTexto,
              styles.navTextoActivo,
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* =========================================
   ESTILOS
========================================= */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F5F9F8',
    },

    scroll: {
      paddingBottom: 120,
    },

    /* HEADER */

    header: {
      width: '100%',
      maxWidth: 1000,

      alignSelf: 'center',

      paddingHorizontal: 25,
      paddingTop: 25,
    },

    logo: {
      fontSize: 27,

      fontWeight: '900',

      letterSpacing: 4,

      color: '#087F8C',
    },

    subtitulo: {
      marginTop: 2,

      fontSize: 12,

      color: '#748589',
    },

    /* PRESENTACIÓN */

    presentacion: {
      width: '100%',
      maxWidth: 1000,

      alignSelf: 'center',

      marginTop: 28,

      paddingHorizontal: 25,
    },

    etiqueta: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    titulo: {
      marginTop: 5,

      fontSize: 29,

      fontWeight: '900',

      color: '#203438',
    },

    descripcionPagina: {
      maxWidth: 650,

      marginTop: 7,

      fontSize: 12,

      lineHeight: 18,

      color: '#748589',
    },

    /* PERFIL */

    perfilCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 25,

      padding: 23,

      borderRadius: 27,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',
    },

    perfilCardMovil: {
      alignItems: 'flex-start',
    },

    avatarCaja: {
      width: 90,
      height: 90,

      minWidth: 90,

      marginRight: 19,

      borderRadius: 45,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    avatarEmoji: {
      fontSize: 42,
    },

    perfilInfo: {
      flex: 1,

      minWidth: 0,
    },

    perfilEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    perfilNombre: {
      marginTop: 5,

      fontSize: 22,

      fontWeight: '900',

      color: '#203438',
    },

    perfilDescripcion: {
      maxWidth: 600,

      marginTop: 7,

      fontSize: 10,

      lineHeight: 16,

      color: '#748589',
    },

    /* SECCIONES */

    seccionHeader: {
      width: '100%',
      maxWidth: 950,

      alignSelf: 'center',

      marginTop: 29,

      paddingHorizontal: 25,
    },

    seccionTitulo: {
      fontSize: 19,

      fontWeight: '900',

      color: '#203438',
    },

    seccionTexto: {
      marginTop: 4,

      fontSize: 10,

      color: '#899699',
    },

    /* CARD */

    card: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 14,

      paddingHorizontal: 19,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    infoFila: {
      paddingVertical: 17,

      flexDirection: 'row',

      alignItems: 'center',
    },

    infoIconoCaja: {
      width: 42,
      height: 42,

      marginRight: 13,

      borderRadius: 16,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    infoIcono: {
      fontSize: 19,
    },

    infoEtiqueta: {
      fontSize: 7,

      fontWeight: '900',

      color: '#087F8C',
    },

    infoValor: {
      marginTop: 4,

      fontSize: 11,

      fontWeight: '800',

      color: '#203438',
    },

    separador: {
      height: 1,

      backgroundColor:
        '#E7EEEE',
    },

    /* ACCESOS */

    accesosGrid: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 14,

      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 12,
    },

    accesosGridMovil: {
      flexDirection: 'column',
    },

    accesoCard: {
      width: '48%',

      minHeight: 190,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',
    },

    accesoCardMovil: {
      width: '100%',
    },

    accesoEmojiCaja: {
      width: 50,
      height: 50,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    accesoEmoji: {
      fontSize: 24,
    },

    accesoTitulo: {
      marginTop: 13,

      fontSize: 16,

      fontWeight: '900',

      color: '#203438',
    },

    accesoTexto: {
      marginTop: 6,

      fontSize: 10,

      lineHeight: 16,

      color: '#748589',
    },

    accesoAccion: {
      marginTop: 13,

      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    /* OPCIONES */

    opcionFila: {
      paddingVertical: 16,

      flexDirection: 'row',

      alignItems: 'center',
    },

    opcionIconoCaja: {
      width: 42,
      height: 42,

      marginRight: 13,

      borderRadius: 16,

      backgroundColor:
        '#F5F9F8',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    opcionIcono: {
      fontSize: 19,
    },

    opcionTitulo: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    opcionTexto: {
      marginTop: 3,

      fontSize: 9,

      color: '#899699',
    },

    flecha: {
      marginTop: -3,

      marginLeft: 10,

      fontSize: 26,

      color: '#087F8C',
    },

    /* RELAX */

    relaxCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 24,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#EAF5F3',

      flexDirection: 'row',

      alignItems: 'center',
    },

    relaxIconoCaja: {
      width: 50,
      height: 50,

      marginRight: 14,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    relaxIcono: {
      fontSize: 24,
    },

    relaxTitulo: {
      fontSize: 15,

      fontWeight: '900',

      letterSpacing: 2,

      color: '#087F8C',
    },

    relaxTexto: {
      maxWidth: 650,

      marginTop: 4,

      fontSize: 9,

      lineHeight: 15,

      color: '#53666A',
    },

    /* NAVEGACIÓN */

    bottomNav: {
      position: 'absolute',

      left: 0,
      right: 0,
      bottom: 0,

      height: 78,

      backgroundColor:
        '#FFFFFF',

      borderTopWidth: 1,

      borderTopColor:
        '#E6EEEE',

      flexDirection: 'row',

      alignItems: 'center',
    },

    navItem: {
      flex: 1,

      alignItems: 'center',
    },

    navEmoji: {
      fontSize: 20,
    },

    navTexto: {
      marginTop: 3,

      fontSize: 9,

      fontWeight: '700',

      color: '#53666A',
    },

    navActivo: {
      opacity: 1,
    },

    navTextoActivo: {
      color: '#087F8C',

      fontWeight: '900',
    },
  });
