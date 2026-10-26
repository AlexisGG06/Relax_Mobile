import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCatalogos } from '../context/CatalogosContext';

export default function HomeScreen() {
  const router = useRouter();
  const { cuentaCreada } = useLocalSearchParams<{ cuentaCreada?: string }>();
  const { zonas } = useCatalogos();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  const categorias = [
    {
      id: 'hospedajes',
      emoji: '🏨',
      titulo: 'Hospedajes',
      descripcion:
        'Hoteles, posadas y cabañas.',
      ruta: '/hospedajes',
    },

    {
      id: 'restaurantes',
      emoji: '🍽️',
      titulo: 'Restaurantes',
      descripcion:
        'Comida y sabores de cada zona.',
      ruta: '/restaurantes',
    },

    {
      id: 'actividades',
      emoji: '🎡',
      titulo: 'Actividades',
      descripcion:
        'Experiencias para tu viaje.',
      ruta: '/actividades',
    },

    {
      id: 'lugares',
      emoji: '🏞️',
      titulo: 'Lugares',
      descripcion:
        'Descubre los destinos de Hidalgo.',
      ruta: '/lugares',
    },
  ];

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
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
              Descubre Hidalgo
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.perfilBoton
            }
            onPress={() =>
              router.push(
                '/perfil' as any
              )
            }
          >
            <Text
              style={
                styles.perfilEmoji
              }
            >
              👤
            </Text>
          </TouchableOpacity>
        </View>

        {cuentaCreada === '1' && (
          <View style={{ width: '90%', maxWidth: 900, alignSelf: 'center', marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: '#E5F3EF' }}>
            <Text accessibilityRole="alert" style={{ color: '#087F8C', fontWeight: '700', fontSize: 16 }}>Cuenta creada exitosamente</Text>
          </View>
        )}

        {/* =====================================
            HERO
        ===================================== */}

        <View style={styles.hero}>
          <View
            style={
              styles.heroContenido
            }
          >
            <Text
              style={styles.etiqueta}
            >
              EXPLORA • RESERVA • DISFRUTA
            </Text>

            <Text
              style={styles.heroTitulo}
            >
              Tu próxima experiencia
              comienza en Hidalgo
            </Text>

            <Text
              style={
                styles.heroDescripcion
              }
            >
              Descubre hospedajes,
              actividades, restaurantes
              y lugares para crear un
              viaje a tu medida.
            </Text>

            <View
              style={
                styles.heroBotones
              }
            >
              <TouchableOpacity
                style={
                  styles.botonPrincipal
                }
                onPress={() =>
                  router.push(
                    '/explorar' as any
                  )
                }
              >
                <Text
                  style={
                    styles.botonPrincipalTexto
                  }
                >
                  Explorar Hidalgo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.botonSecundario
                }
                onPress={() =>
                  router.push(
                    '/mi-viaje' as any
                  )
                }
              >
                <Text
                  style={
                    styles.botonSecundarioTexto
                  }
                >
                  Ver Mi viaje
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {!esMovil && (
            <View
              style={
                styles.heroDecoracion
              }
            >
              <View
                style={
                  styles.heroCirculoGrande
                }
              >
                <Text
                  style={
                    styles.heroEmojiGrande
                  }
                >
                  🌄
                </Text>
              </View>

              <View
                style={
                  styles.heroMiniCard
                }
              >
                <Text
                  style={
                    styles.heroMiniEmoji
                  }
                >
                  🌲
                </Text>

                <View>
                  <Text
                    style={
                      styles.heroMiniTitulo
                    }
                  >
                    Hidalgo
                  </Text>

                  <Text
                    style={
                      styles.heroMiniTexto
                    }
                  >
                    Naturaleza y cultura
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* =====================================
            CATEGORÍAS
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
            ¿Qué estás buscando?
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Todo lo necesario para
            organizar tu viaje
          </Text>
        </View>

        <View
          style={[
            styles.categoriasGrid,

            esMovil &&
              styles.categoriasGridMovil,
          ]}
        >
          {categorias.map(
            (categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.categoriaCard,

                  esMovil &&
                    styles.categoriaCardMovil,
                ]}
                onPress={() =>
                  router.push(
                    categoria.ruta as any
                  )
                }
              >
                <View
                  style={
                    styles.categoriaEmojiCaja
                  }
                >
                  <Text
                    style={
                      styles.categoriaEmoji
                    }
                  >
                    {
                      categoria.emoji
                    }
                  </Text>
                </View>

                <Text
                  style={
                    styles.categoriaTitulo
                  }
                >
                  {categoria.titulo}
                </Text>

                <Text
                  style={
                    styles.categoriaDescripcion
                  }
                >
                  {
                    categoria.descripcion
                  }
                </Text>

                <View
                  style={
                    styles.categoriaAccion
                  }
                >
                  <Text
                    style={
                      styles.categoriaAccionTexto
                    }
                  >
                    Ver opciones
                  </Text>

                  <Text
                    style={
                      styles.categoriaFlecha
                    }
                  >
                    ›
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* =====================================
            DESTINOS
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
            Destinos destacados
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Elige una zona para comenzar
          </Text>
        </View>

        <View
          style={[
            styles.destinosGrid,

            esMovil &&
              styles.destinosGridMovil,
          ]}
        >
          {zonas.map((zona) => (
            <TouchableOpacity key={zona.id} style={[styles.destinoCard, esMovil && styles.destinoCardMovil]}
              onPress={() => router.push({ pathname: '/hospedajes', params: { zona: zona.nombre } })}>
              <View style={styles.destinoEmojiCaja}><Text style={styles.destinoEmoji}>{zona.emoji}</Text></View>
              <Text style={styles.destinoEtiqueta}>PUEBLO MÁGICO</Text>
              <Text style={styles.destinoNombre}>{zona.nombre}</Text>
              <Text numberOfLines={3} style={styles.destinoDescripcion}>{zona.resumen}</Text>
              <Text style={styles.destinoAccion}>Ver hospedajes →</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* =====================================
            CÓMO FUNCIONA
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
            Organiza tu viaje
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            RELAX te ayuda paso a paso
          </Text>
        </View>

        <View
          style={
            styles.pasosCard
          }
        >
          <View
            style={
              styles.pasoFila
            }
          >
            <View
              style={
                styles.pasoNumero
              }
            >
              <Text
                style={
                  styles.pasoNumeroTexto
                }
              >
                1
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.pasoTitulo
                }
              >
                Explora
              </Text>

              <Text
                style={
                  styles.pasoTexto
                }
              >
                Conoce las zonas,
                actividades y
                restaurantes disponibles.
              </Text>
            </View>
          </View>

          <View
            style={
              styles.pasoSeparador
            }
          />

          <View
            style={
              styles.pasoFila
            }
          >
            <View
              style={
                styles.pasoNumero
              }
            >
              <Text
                style={
                  styles.pasoNumeroTexto
                }
              >
                2
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.pasoTitulo
                }
              >
                Reserva
              </Text>

              <Text
                style={
                  styles.pasoTexto
                }
              >
                Selecciona tu hospedaje,
                fechas y número de
                huéspedes.
              </Text>
            </View>
          </View>

          <View
            style={
              styles.pasoSeparador
            }
          />

          <View
            style={
              styles.pasoFila
            }
          >
            <View
              style={
                styles.pasoNumero
              }
            >
              <Text
                style={
                  styles.pasoNumeroTexto
                }
              >
                3
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.pasoTitulo
                }
              >
                Personaliza
              </Text>

              <Text
                style={
                  styles.pasoTexto
                }
              >
                Agrega actividades y
                restaurantes de la misma
                zona.
              </Text>
            </View>
          </View>

          <View
            style={
              styles.pasoSeparador
            }
          />

          <View
            style={
              styles.pasoFila
            }
          >
            <View
              style={
                styles.pasoNumero
              }
            >
              <Text
                style={
                  styles.pasoNumeroTexto
                }
              >
                4
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.pasoTitulo
                }
              >
                Disfruta
              </Text>

              <Text
                style={
                  styles.pasoTexto
                }
              >
                Consulta todo tu
                itinerario desde Mi
                viaje.
              </Text>
            </View>
          </View>
        </View>

        {/* =====================================
            CTA
        ===================================== */}

        <View
          style={styles.ctaCard}
        >
          <View
            style={styles.ctaIcono}
          >
            <Text
              style={
                styles.ctaEmoji
              }
            >
              ✨
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={
                styles.ctaTitulo
              }
            >
              Empieza a planear
            </Text>

            <Text
              style={styles.ctaTexto}
            >
              Descubre qué zona de
              Hidalgo quieres visitar y
              construye tu experiencia.
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.ctaBoton
            }
            onPress={() =>
              router.push(
                '/explorar' as any
              )
            }
          >
            <Text
              style={
                styles.ctaBotonTexto
              }
            >
              Explorar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* =====================================
          ASISTENTE FLOTANTE
      ===================================== */}

      <TouchableOpacity
        style={
          styles.asistenteBoton
        }
        onPress={() =>
          router.push(
            '/asistente' as any
          )
        }
      >
        <Text
          style={
            styles.asistenteEmoji
          }
        >
          💬
        </Text>
      </TouchableOpacity>

      {/* =====================================
          NAVEGACIÓN
      ===================================== */}

      <View
        style={styles.bottomNav}
      >
        <TouchableOpacity
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navEmoji,
              styles.navActivo,
            ]}
          >
            🏠
          </Text>

          <Text
            style={[
              styles.navTexto,
              styles.navTextoActivo,
            ]}
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
          onPress={() =>
            router.replace(
              '/perfil' as any
            )
          }
        >
          <Text
            style={styles.navEmoji}
          >
            👤
          </Text>

          <Text
            style={styles.navTexto}
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
      paddingBottom: 130,
    },

    /* HEADER */

    header: {
      width: '100%',
      maxWidth: 1000,
      alignSelf: 'center',

      paddingHorizontal: 25,
      paddingTop: 25,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
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

    perfilBoton: {
      width: 44,
      height: 44,

      borderRadius: 22,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    perfilEmoji: {
      fontSize: 20,
    },

    /* HERO */

    hero: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 30,

      padding: 28,

      borderRadius: 28,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',

      overflow: 'hidden',
    },

    heroContenido: {
      flex: 1,
      zIndex: 2,
    },

    etiqueta: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    heroTitulo: {
      maxWidth: 520,

      marginTop: 8,

      fontSize: 34,

      lineHeight: 40,

      fontWeight: '900',

      color: '#203438',
    },

    heroDescripcion: {
      maxWidth: 520,

      marginTop: 12,

      fontSize: 12,

      lineHeight: 19,

      color: '#748589',
    },

    heroBotones: {
      marginTop: 21,

      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 9,
    },

    botonPrincipal: {
      paddingHorizontal: 20,
      paddingVertical: 13,

      borderRadius: 18,

      backgroundColor:
        '#087F8C',
    },

    botonPrincipalTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    botonSecundario: {
      paddingHorizontal: 20,
      paddingVertical: 13,

      borderRadius: 18,

      backgroundColor:
        '#EAF5F3',
    },

    botonSecundarioTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#087F8C',
    },

    heroDecoracion: {
      width: 250,
      height: 230,

      marginLeft: 20,

      justifyContent:
        'center',

      alignItems: 'center',
    },

    heroCirculoGrande: {
      width: 180,
      height: 180,

      borderRadius: 90,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    heroEmojiGrande: {
      fontSize: 76,
    },

    heroMiniCard: {
      position: 'absolute',

      left: 5,
      bottom: 10,

      paddingHorizontal: 13,
      paddingVertical: 10,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',
    },

    heroMiniEmoji: {
      marginRight: 8,
      fontSize: 20,
    },

    heroMiniTitulo: {
      fontSize: 9,

      fontWeight: '900',

      color: '#203438',
    },

    heroMiniTexto: {
      marginTop: 2,

      fontSize: 7,

      color: '#899699',
    },

    /* SECCIONES */

    seccionHeader: {
      width: '100%',
      maxWidth: 950,

      alignSelf: 'center',

      marginTop: 30,

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

    /* CATEGORÍAS */

    categoriasGrid: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 15,

      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 12,
    },

    categoriasGridMovil: {
      flexDirection: 'column',
    },

    categoriaCard: {
      width: '48%',

      minHeight: 185,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',
    },

    categoriaCardMovil: {
      width: '100%',
    },

    categoriaEmojiCaja: {
      width: 52,
      height: 52,

      borderRadius: 18,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    categoriaEmoji: {
      fontSize: 26,
    },

    categoriaTitulo: {
      marginTop: 13,

      fontSize: 17,

      fontWeight: '900',

      color: '#203438',
    },

    categoriaDescripcion: {
      marginTop: 6,

      fontSize: 10,

      lineHeight: 16,

      color: '#748589',
    },

    categoriaAccion: {
      marginTop: 13,

      flexDirection: 'row',

      alignItems: 'center',
    },

    categoriaAccionTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    categoriaFlecha: {
      marginTop: -2,
      marginLeft: 5,

      fontSize: 20,

      color: '#087F8C',
    },

    /* DESTINOS */

    destinosGrid: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 15,

      flexDirection: 'row',

      gap: 12,
    },

    destinosGridMovil: {
      flexDirection: 'column',
    },

    destinoCard: {
      flex: 1,

      minHeight: 220,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',
    },

    destinoCardMovil: {
      width: '100%',
    },

    destinoEmojiCaja: {
      width: 50,
      height: 50,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    destinoEmoji: {
      fontSize: 25,
    },

    destinoEtiqueta: {
      marginTop: 14,

      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    destinoNombre: {
      marginTop: 4,

      fontSize: 17,

      lineHeight: 21,

      fontWeight: '900',

      color: '#203438',
    },

    destinoDescripcion: {
      marginTop: 8,

      fontSize: 10,

      lineHeight: 16,

      color: '#748589',
    },

    destinoAccion: {
      marginTop: 15,

      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    /* PASOS */

    pasosCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 15,

      paddingHorizontal: 20,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    pasoFila: {
      paddingVertical: 18,

      flexDirection: 'row',

      alignItems: 'center',
    },

    pasoNumero: {
      width: 38,
      height: 38,

      marginRight: 13,

      borderRadius: 19,

      backgroundColor:
        '#087F8C',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    pasoNumeroTexto: {
      fontSize: 12,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    pasoTitulo: {
      fontSize: 12,

      fontWeight: '900',

      color: '#203438',
    },

    pasoTexto: {
      marginTop: 4,

      fontSize: 9,

      lineHeight: 15,

      color: '#748589',
    },

    pasoSeparador: {
      height: 1,

      backgroundColor:
        '#E7EEEE',
    },

    /* CTA */

    ctaCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 25,

      padding: 19,

      borderRadius: 24,

      backgroundColor:
        '#EAF5F3',

      flexDirection: 'row',

      alignItems: 'center',

      gap: 13,
    },

    ctaIcono: {
      width: 48,
      height: 48,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    ctaEmoji: {
      fontSize: 23,
    },

    ctaTitulo: {
      fontSize: 13,

      fontWeight: '900',

      color: '#203438',
    },

    ctaTexto: {
      maxWidth: 540,

      marginTop: 4,

      fontSize: 9,

      lineHeight: 15,

      color: '#53666A',
    },

    ctaBoton: {
      paddingHorizontal: 17,
      paddingVertical: 11,

      borderRadius: 17,

      backgroundColor:
        '#087F8C',
    },

    ctaBotonTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    /* ASISTENTE */

    asistenteBoton: {
      position: 'absolute',

      right: 24,
      bottom: 95,

      width: 56,
      height: 56,

      borderRadius: 28,

      backgroundColor:
        '#087F8C',

      justifyContent:
        'center',

      alignItems: 'center',

      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 5,
    },

    asistenteEmoji: {
      fontSize: 24,
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
