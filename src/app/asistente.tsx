import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSesion } from '../context/SesionContext';
import { api } from '../services/api';

import { useViaje } from '../context/ViajeContext';

/* =========================================
   TIPOS
========================================= */

type Mensaje = {
  id: number;
  autor: 'usuario' | 'asistente';
  texto: string;
};

/* =========================================
   PREGUNTAS RÁPIDAS
========================================= */

const PREGUNTAS = [
  {
    id: 'lugares',
    emoji: '🏞️',
    texto:
      '¿Qué lugares puedo visitar?',
  },

  {
    id: 'comer',
    emoji: '🍽️',
    texto:
      '¿Dónde puedo comer?',
  },

  {
    id: 'naturaleza',
    emoji: '🌲',
    texto:
      'Quiero naturaleza',
  },

  {
    id: 'huasca',
    emoji: '🏘️',
    texto:
      '¿Qué hay en Huasca?',
  },

  {
    id: 'real',
    emoji: '⛏️',
    texto:
      '¿Qué hay en Real del Monte?',
  },

  {
    id: 'chico',
    emoji: '⛰️',
    texto:
      '¿Qué hay en Mineral del Chico?',
  },

  {
    id: 'plan',
    emoji: '🗓️',
    texto:
      'Ayúdame con mi viaje',
  },

  {
    id: 'tranquilo',
    emoji: '☕',
    texto:
      'Quiero algo tranquilo',
  },

  {
    id: 'tips',
    emoji: '💡',
    texto:
      'Dame recomendaciones',
  },
];

/* =========================================
   PANTALLA
========================================= */

export default function AsistenteScreen() {
  const { usuario } = useSesion();
  const [errorHistorial, setErrorHistorial] = useState('');
  const router = useRouter();

  const {
    hospedaje,
    actividades,
    restaurantes,
    favoritosActividades,
    favoritosRestaurantes,
  } = useViaje();

  const [mensajes, setMensajes] =
    useState<Mensaje[]>([
      {
        id: 1,
        autor: 'asistente',

        texto:
          '¡Hola! Soy el asistente de RELAX. Puedo ayudarte a conocer opciones de Hidalgo y también darte recomendaciones relacionadas con tu viaje.',
      },
    ]);

  useEffect(() => {
    let activo = true;
    if (usuario?.rol === 'cliente') {
      api<{ mensajes: Mensaje[] }>('mensajes').then((r) => { if (activo && r.mensajes.length) setMensajes(r.mensajes.reverse()); })
        .catch((e: Error) => { if (activo) setErrorHistorial(e.message); });
    } else { Promise.resolve().then(() => { if (activo) setMensajes([{ id: 1, autor: 'asistente', texto: 'Hola, puedo ayudarte a explorar Hidalgo. Inicia sesión para conservar el historial.' }]); }); }
    return () => { activo = false; };
  }, [usuario]);

  /* =========================================
     RESPUESTAS
  ========================================= */

  const obtenerRespuesta = (
    id: string
  ) => {
    if (id === 'lugares') {
      if (hospedaje) {
        return `Como tu hospedaje está en ${hospedaje.ubicacion}, te recomiendo comenzar explorando los lugares destacados de esa misma zona. También puedes entrar a Lugares para conocer atractivos, actividades y restaurantes cercanos.`;
      }

      return 'Puedes comenzar con Huasca de Ocampo, Real del Monte o Mineral del Chico. En Lugares encontrarás un resumen de cada zona, sus atractivos, actividades y restaurantes.';
    }

    if (id === 'comer') {
      if (hospedaje) {
        if (
          favoritosRestaurantes.length >
          0
        ) {
          return `Ya tienes restaurantes marcados como favoritos. Como reservaste en ${hospedaje.ubicacion}, en el apartado Restaurantes aparecerán primero los favoritos que correspondan con esa zona.`;
        }

        return `Como tu hospedaje está en ${hospedaje.ubicacion}, entra a Restaurantes para ver únicamente opciones de esa misma zona, junto con el tipo de comida, menú y consumo aproximado.`;
      }

      return 'Primero puedes explorar los restaurantes de cada zona desde Lugares. Ahí puedes consultar el tipo de comida, el menú aproximado y guardar tus favoritos antes de reservar.';
    }

    if (id === 'naturaleza') {
      return 'Si buscas naturaleza, Huasca de Ocampo y Mineral del Chico son buenas opciones dentro de RELAX. Huasca tiene bosques y los Prismas Basálticos, mientras que Mineral del Chico está más enfocado en montaña, senderismo y miradores.';
    }

    if (id === 'huasca') {
      return 'Huasca de Ocampo combina naturaleza, bosques, recorridos culturales y paisajes. Puedes encontrar actividades como la visita a los Prismas Basálticos, caminatas por el bosque, recorridos por el centro y opciones de comida tradicional.';
    }

    if (id === 'real') {
      return 'Real del Monte está enfocado en historia, cultura y tradición minera. Puedes realizar recorridos históricos, conocer espacios relacionados con la minería y disfrutar de su gastronomía, especialmente los pastes.';
    }

    if (id === 'chico') {
      return 'Mineral del Chico es una opción para quienes buscan naturaleza y aventura. Encontrarás senderismo, bosques, rutas de miradores, recorridos de montaña y diferentes opciones para comer después de las actividades.';
    }

    if (id === 'plan') {
      if (!hospedaje) {
        return 'Para comenzar tu viaje te recomiendo elegir primero una zona y reservar un hospedaje. Después RELAX habilitará las actividades y restaurantes correspondientes a ese lugar.';
      }

      const partes: string[] = [];

      partes.push(
        `Tu hospedaje está en ${hospedaje.ubicacion}.`
      );

      if (
        actividades.length > 0
      ) {
        partes.push(
          `Ya agregaste ${actividades.length} actividad${actividades.length > 1 ? 'es' : ''}.`
        );
      } else {
        partes.push(
          'Todavía puedes agregar actividades de esa zona.'
        );
      }

      if (
        restaurantes.length > 0
      ) {
        partes.push(
          `También agregaste ${restaurantes.length} restaurante${restaurantes.length > 1 ? 's' : ''} a tu itinerario.`
        );
      } else {
        partes.push(
          'Puedes agregar restaurantes para completar tu itinerario.'
        );
      }

      partes.push(
        'Consulta Mi viaje para ver todo organizado por día.'
      );

      return partes.join(' ');
    }

    if (id === 'tranquilo') {
      return 'Para un viaje tranquilo puedes considerar recorridos por los centros de los Pueblos Mágicos, cafeterías, paseos fotográficos, miradores y caminatas suaves. Huasca y Real del Monte tienen varias opciones de este tipo.';
    }

    if (id === 'tips') {
      if (hospedaje) {
        return `Ya tienes hospedaje en ${hospedaje.ubicacion}. Te recomiendo revisar primero tus favoritos, elegir las actividades que realmente quieras hacer y distribuirlas entre los días de tu estancia para no saturar el itinerario.`;
      }

      return 'Antes de reservar, compara las tres zonas, guarda actividades y restaurantes favoritos y después selecciona el hospedaje que mejor coincida con lo que quieres hacer.';
    }

    return 'Puedo ayudarte a explorar las opciones disponibles en RELAX.';
  };

  /* =========================================
     ENVIAR PREGUNTA
  ========================================= */

  const seleccionarPregunta = (
    id: string,
    texto: string
  ) => {
    const respuesta = obtenerRespuesta(id);
    setMensajes((actuales) => {
      const siguiente = (actuales[actuales.length - 1]?.id ?? 0) + 1;
      return [...actuales, { id: siguiente, autor: 'usuario', texto }, { id: siguiente + 1, autor: 'asistente', texto: respuesta }];
    });
    if (usuario?.rol === 'cliente') api('mensajes', { pregunta: texto, respuesta })
      .catch((e: Error) => setErrorHistorial(e.message));
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      {!!errorHistorial && <Text accessibilityRole="alert">{errorHistorial}</Text>}
      {/* =====================================
          HEADER
      ===================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.regresar}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.regresarTexto
            }
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.asistenteIcono
          }
        >
          <Text
            style={
              styles.asistenteEmoji
            }
          >
            💬
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.logo}>
            RELAX
          </Text>

          <View
            style={
              styles.estadoFila
            }
          >
            <View
              style={
                styles.estadoPunto
              }
            />

            <Text
              style={
                styles.estadoTexto
              }
            >
              Asistente de viaje
            </Text>
          </View>
        </View>
      </View>

      {/* =====================================
          CONTENIDO
      ===================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContenido
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* PRESENTACIÓN */}

        <View
          style={
            styles.presentacion
          }
        >
          <Text
            style={styles.etiqueta}
          >
            ASISTENTE RELAX
          </Text>

          <Text
            style={styles.titulo}
          >
            ¿En qué te puedo ayudar?
          </Text>

          <Text
            style={
              styles.descripcion
            }
          >
            Selecciona una pregunta para
            recibir información sobre tu
            viaje y los destinos
            disponibles en RELAX.
          </Text>
        </View>

        {/* =====================================
            MENSAJES
        ===================================== */}

        <View
          style={
            styles.chatContenedor
          }
        >
          {mensajes.map(
            (mensaje) => (
              <View
                key={mensaje.id}
                style={[
                  styles.mensajeFila,

                  mensaje.autor ===
                    'usuario' &&
                    styles.mensajeFilaUsuario,
                ]}
              >
                {mensaje.autor ===
                  'asistente' && (
                  <View
                    style={
                      styles.avatarAsistente
                    }
                  >
                    <Text
                      style={
                        styles.avatarEmoji
                      }
                    >
                      ✨
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.mensaje,

                    mensaje.autor ===
                    'usuario'
                      ? styles.mensajeUsuario
                      : styles.mensajeAsistente,
                  ]}
                >
                  {mensaje.autor ===
                    'asistente' && (
                    <Text
                      style={
                        styles.mensajeAutor
                      }
                    >
                      RELAX
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.mensajeTexto,

                      mensaje.autor ===
                        'usuario' &&
                        styles.mensajeTextoUsuario,
                    ]}
                  >
                    {mensaje.texto}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>

        {/* =====================================
            ESTADO DEL VIAJE
        ===================================== */}

        {hospedaje && (
          <View
            style={
              styles.viajeCard
            }
          >
            <View
              style={
                styles.viajeIconoCaja
              }
            >
              <Text
                style={
                  styles.viajeIcono
                }
              >
                🧳
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.viajeEtiqueta
                }
              >
                TU VIAJE ACTUAL
              </Text>

              <Text
                style={
                  styles.viajeTitulo
                }
              >
                {hospedaje.ubicacion}
              </Text>

              <Text
                style={
                  styles.viajeTexto
                }
              >
                🏨 {hospedaje.nombre}
              </Text>

              <View
                style={
                  styles.viajeDatos
                }
              >
                <View
                  style={styles.chip}
                >
                  <Text
                    style={
                      styles.chipTexto
                    }
                  >
                    🎡{' '}
                    {
                      actividades.length
                    }{' '}
                    actividades
                  </Text>
                </View>

                <View
                  style={styles.chip}
                >
                  <Text
                    style={
                      styles.chipTexto
                    }
                  >
                    🍽️{' '}
                    {
                      restaurantes.length
                    }{' '}
                    restaurantes
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={
                styles.viajeBoton
              }
              onPress={() =>
                router.push(
                  '/mi-viaje' as any
                )
              }
            >
              <Text
                style={
                  styles.viajeBotonTexto
                }
              >
                Ver viaje
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =====================================
            PREGUNTAS RÁPIDAS
        ===================================== */}

        <View
          style={
            styles.preguntasHeader
          }
        >
          <Text
            style={
              styles.preguntasTitulo
            }
          >
            Preguntas rápidas
          </Text>

          <Text
            style={
              styles.preguntasTexto
            }
          >
            Toca una opción para continuar
          </Text>
        </View>

        <View
          style={
            styles.preguntasGrid
          }
        >
          {PREGUNTAS.map(
            (pregunta) => (
              <TouchableOpacity
                key={pregunta.id}
                style={
                  styles.preguntaCard
                }
                onPress={() =>
                  seleccionarPregunta(
                    pregunta.id,
                    pregunta.texto
                  )
                }
              >
                <View
                  style={
                    styles.preguntaEmojiCaja
                  }
                >
                  <Text
                    style={
                      styles.preguntaEmoji
                    }
                  >
                    {
                      pregunta.emoji
                    }
                  </Text>
                </View>

                <Text
                  style={
                    styles.preguntaTexto
                  }
                >
                  {pregunta.texto}
                </Text>

                <Text
                  style={
                    styles.preguntaFlecha
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* =====================================
            FAVORITOS
        ===================================== */}

        {(favoritosActividades.length >
          0 ||
          favoritosRestaurantes.length >
            0) && (
          <View
            style={
              styles.favoritosCard
            }
          >
            <View
              style={
                styles.favoritosHeader
              }
            >
              <Text
                style={
                  styles.favoritosTitulo
                }
              >
                ❤️ Tus favoritos
              </Text>

              <Text
                style={
                  styles.favoritosSubtitulo
                }
              >
                Guardados mientras
                explorabas
              </Text>
            </View>

            {favoritosActividades.length >
              0 && (
              <View
                style={
                  styles.favoritoGrupo
                }
              >
                <Text
                  style={
                    styles.favoritoGrupoTitulo
                  }
                >
                  🎡 Actividades
                </Text>

                {favoritosActividades
                  .slice(0, 3)
                  .map(
                    (nombre) => (
                      <Text
                        key={nombre}
                        style={
                          styles.favoritoItem
                        }
                      >
                        • {nombre}
                      </Text>
                    )
                  )}
              </View>
            )}

            {favoritosRestaurantes.length >
              0 && (
              <View
                style={
                  styles.favoritoGrupo
                }
              >
                <Text
                  style={
                    styles.favoritoGrupoTitulo
                  }
                >
                  🍽️ Restaurantes
                </Text>

                {favoritosRestaurantes
                  .slice(0, 3)
                  .map(
                    (nombre) => (
                      <Text
                        key={nombre}
                        style={
                          styles.favoritoItem
                        }
                      >
                        • {nombre}
                      </Text>
                    )
                  )}
              </View>
            )}

            <TouchableOpacity
              style={
                styles.favoritosBoton
              }
              onPress={() =>
                router.push(
                  '/lugares' as any
                )
              }
            >
              <Text
                style={
                  styles.favoritosBotonTexto
                }
              >
                Seguir explorando
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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

    /* HEADER */

    header: {
      width: '100%',
      maxWidth: 1000,

      alignSelf: 'center',

      paddingHorizontal: 25,
      paddingTop: 22,
      paddingBottom: 17,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        '#F5F9F8',
    },

    regresar: {
      width: 44,
      height: 44,

      marginRight: 12,

      borderRadius: 22,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    regresarTexto: {
      marginTop: -5,

      fontSize: 33,

      color: '#203438',
    },

    asistenteIcono: {
      width: 46,
      height: 46,

      marginRight: 12,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    asistenteEmoji: {
      fontSize: 21,
    },

    logo: {
      fontSize: 22,

      fontWeight: '900',

      letterSpacing: 3,

      color: '#087F8C',
    },

    estadoFila: {
      marginTop: 3,

      flexDirection: 'row',

      alignItems: 'center',
    },

    estadoPunto: {
      width: 7,
      height: 7,

      marginRight: 5,

      borderRadius: 4,

      backgroundColor:
        '#51B788',
    },

    estadoTexto: {
      fontSize: 9,

      color: '#748589',
    },

    /* SCROLL */

    scroll: {
      flex: 1,
    },

    scrollContenido: {
      paddingBottom: 50,
    },

    /* PRESENTACIÓN */

    presentacion: {
      width: '100%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 12,

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

      fontSize: 28,

      fontWeight: '900',

      color: '#203438',
    },

    descripcion: {
      maxWidth: 650,

      marginTop: 7,

      fontSize: 11,

      lineHeight: 18,

      color: '#748589',
    },

    /* CHAT */

    chatContenedor: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 23,
    },

    mensajeFila: {
      marginBottom: 14,

      flexDirection: 'row',

      alignItems: 'flex-end',
    },

    mensajeFilaUsuario: {
      justifyContent:
        'flex-end',
    },

    avatarAsistente: {
      width: 34,
      height: 34,

      marginRight: 8,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    avatarEmoji: {
      fontSize: 15,
    },

    mensaje: {
      maxWidth: '78%',

      paddingHorizontal: 15,
      paddingVertical: 12,

      borderRadius: 20,
    },

    mensajeAsistente: {
      backgroundColor:
        '#FFFFFF',

      borderBottomLeftRadius: 6,
    },

    mensajeUsuario: {
      backgroundColor:
        '#087F8C',

      borderBottomRightRadius: 6,
    },

    mensajeAutor: {
      marginBottom: 5,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    mensajeTexto: {
      fontSize: 10,

      lineHeight: 17,

      color: '#53666A',
    },

    mensajeTextoUsuario: {
      color: '#FFFFFF',

      fontWeight: '700',
    },

    /* VIAJE */

    viajeCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 10,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',

      flexWrap: 'wrap',

      gap: 12,
    },

    viajeIconoCaja: {
      width: 52,
      height: 52,

      borderRadius: 18,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    viajeIcono: {
      fontSize: 25,
    },

    viajeEtiqueta: {
      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    viajeTitulo: {
      marginTop: 3,

      fontSize: 15,

      fontWeight: '900',

      color: '#203438',
    },

    viajeTexto: {
      marginTop: 4,

      fontSize: 9,

      color: '#748589',
    },

    viajeDatos: {
      marginTop: 8,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    chip: {
      marginRight: 6,
      marginBottom: 4,

      paddingHorizontal: 8,
      paddingVertical: 6,

      borderRadius: 13,

      backgroundColor:
        '#EAF5F3',
    },

    chipTexto: {
      fontSize: 8,

      fontWeight: '800',

      color: '#087F8C',
    },

    viajeBoton: {
      paddingHorizontal: 16,
      paddingVertical: 11,

      borderRadius: 17,

      backgroundColor:
        '#087F8C',
    },

    viajeBotonTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    /* PREGUNTAS */

    preguntasHeader: {
      width: '100%',
      maxWidth: 950,

      alignSelf: 'center',

      marginTop: 27,

      paddingHorizontal: 25,
    },

    preguntasTitulo: {
      fontSize: 18,

      fontWeight: '900',

      color: '#203438',
    },

    preguntasTexto: {
      marginTop: 4,

      fontSize: 9,

      color: '#899699',
    },

    preguntasGrid: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 13,
    },

    preguntaCard: {
      marginBottom: 9,

      padding: 14,

      borderRadius: 20,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',
    },

    preguntaEmojiCaja: {
      width: 40,
      height: 40,

      marginRight: 12,

      borderRadius: 15,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    preguntaEmoji: {
      fontSize: 18,
    },

    preguntaTexto: {
      flex: 1,

      fontSize: 10,

      fontWeight: '800',

      color: '#203438',
    },

    preguntaFlecha: {
      marginTop: -3,

      fontSize: 25,

      color: '#087F8C',
    },

    /* FAVORITOS */

    favoritosCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 17,

      padding: 19,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',
    },

    favoritosHeader: {
      paddingBottom: 12,

      borderBottomWidth: 1,

      borderBottomColor:
        '#E7EEEE',
    },

    favoritosTitulo: {
      fontSize: 16,

      fontWeight: '900',

      color: '#203438',
    },

    favoritosSubtitulo: {
      marginTop: 4,

      fontSize: 9,

      color: '#899699',
    },

    favoritoGrupo: {
      marginTop: 14,
    },

    favoritoGrupoTitulo: {
      fontSize: 10,

      fontWeight: '900',

      color: '#087F8C',
    },

    favoritoItem: {
      marginTop: 7,

      fontSize: 9,

      color: '#53666A',
    },

    favoritosBoton: {
      marginTop: 17,

      paddingVertical: 12,

      borderRadius: 18,

      backgroundColor:
        '#EAF5F3',

      alignItems: 'center',
    },

    favoritosBotonTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },
  });
