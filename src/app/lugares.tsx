import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useCatalogos } from '../context/CatalogosContext';

import { useViaje } from '../context/ViajeContext';

export default function LugaresScreen() {
  const { zonas: ZONAS } = useCatalogos();
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  const {
    favoritosActividades,
    favoritosRestaurantes,
    toggleFavoritoActividad,
    toggleFavoritoRestaurante,
  } = useViaje();

  const dinero = (
    cantidad: number
  ) => {
    return cantidad.toLocaleString(
      'es-MX'
    );
  };

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
          <TouchableOpacity
            style={styles.regresar}
            onPress={() =>
              router.replace(
                '/explorar' as any
              )
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

          <View>
            <Text style={styles.logo}>
              RELAX
            </Text>

            <Text
              style={styles.subtitulo}
            >
              Explora Hidalgo
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
            DESCUBRE HIDALGO
          </Text>

          <Text style={styles.titulo}>
            Lugares
          </Text>

          <Text
            style={
              styles.descripcionPagina
            }
          >
            Conoce las principales
            zonas, revisa actividades,
            restaurantes y lugares
            destacados antes de elegir
            dónde hospedarte.
          </Text>
        </View>

        {/* =====================================
            ZONAS
        ===================================== */}

        {ZONAS.map((zona) => (
          <View
            key={zona.id}
            style={styles.zonaContenedor}
          >
            {/* CABECERA ZONA */}

            <View
              style={
                styles.zonaEncabezado
              }
            >
              <View
                style={
                  styles.zonaEmojiCaja
                }
              >
                <Text
                  style={
                    styles.zonaEmoji
                  }
                >
                  {zona.emoji}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={
                    styles.zonaEtiqueta
                  }
                >
                  PUEBLO MÁGICO
                </Text>

                <Text
                  style={
                    styles.zonaNombre
                  }
                >
                  {zona.nombre}
                </Text>

                <Text
                  style={styles.estado}
                >
                  Hidalgo, México
                </Text>
              </View>
            </View>

            {/* RESUMEN */}

            <Text
              style={styles.resumen}
            >
              {zona.resumen}
            </Text>

            {/* =====================================
                HOSPEDAJES
            ===================================== */}

            <View
              style={styles.seccion}
            >
              <View
                style={
                  styles.seccionHeader
                }
              >
                <View>
                  <Text
                    style={
                      styles.seccionTitulo
                    }
                  >
                    🏨 Hospedajes
                  </Text>

                  <Text
                    style={
                      styles.seccionTexto
                    }
                  >
                    Opciones para quedarte
                    en {zona.nombre}
                  </Text>
                </View>
              </View>

              <View
                style={styles.hotelCard}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={
                      styles.hotelEtiqueta
                    }
                  >
                    HOSPEDAJE DESTACADO
                  </Text>

                  <Text
                    style={
                      styles.hotelNombre
                    }
                  >
                    {
                      zona.hospedaje
                        .nombre
                    }
                  </Text>

                  <Text
                    style={
                      styles.hotelPrecio
                    }
                  >
                    Desde $
                    {dinero(
                      zona.hospedaje
                        .precio
                    )}{' '}
                    por noche
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.botonHospedajes
                  }
                  onPress={() =>
                    router.push({
                      pathname:
                        '/hospedajes',

                      params: {
                        zona:
                          zona.nombre,
                      },
                    } as any)
                  }
                >
                  <Text
                    style={
                      styles.botonHospedajesTexto
                    }
                  >
                    Ver hospedajes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* =====================================
                ACTIVIDADES
            ===================================== */}

            <View
              style={styles.seccion}
            >
              <View
                style={
                  styles.seccionHeader
                }
              >
                <View>
                  <Text
                    style={
                      styles.seccionTitulo
                    }
                  >
                    🎡 Actividades
                  </Text>

                  <Text
                    style={
                      styles.seccionTexto
                    }
                  >
                    Conoce qué puedes
                    hacer y guarda tus
                    favoritas.
                  </Text>
                </View>
              </View>

              {zona.actividades.map(
                (actividad) => {
                  const favorito =
                    favoritosActividades.includes(
                      actividad.nombre
                    );

                  return (
                    <View
                      key={
                        actividad.nombre
                      }
                      style={
                        styles.itemCard
                      }
                    >
                      <View
                        style={[
                          styles.itemPrincipal,

                          esMovil &&
                            styles.itemPrincipalMovil,
                        ]}
                      >
                        {/* IMAGEN */}

                        {actividad.imagen ? (
                          <Image
                            source={
                              typeof actividad.imagen ===
                              'string'
                                ? {
                                    uri:
                                      actividad.imagen,
                                  }
                                : actividad.imagen
                            }
                            style={[
                              styles.imagenItem,

                              esMovil &&
                                styles.imagenItemMovil,
                            ]}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.imagenPlaceholder,

                              esMovil &&
                                styles.imagenItemMovil,
                            ]}
                          >
                            <Text
                              style={
                                styles.placeholderEmoji
                              }
                            >
                              {
                                actividad.emoji
                              }
                            </Text>
                          </View>
                        )}

                        {/* INFORMACIÓN */}

                        <View
                          style={[
                            styles.infoItem,

                            esMovil &&
                              styles.infoItemMovil,
                          ]}
                        >
                          <View
                            style={
                              styles.itemTituloFila
                            }
                          >
                            <View
                              style={{
                                flex: 1,
                              }}
                            >
                              <Text
                                style={
                                  styles.itemTipo
                                }
                              >
                                {
                                  actividad.tipo
                                }
                              </Text>

                              <Text
                                style={
                                  styles.itemNombre
                                }
                              >
                                {
                                  actividad.nombre
                                }
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={
                                styles.favorito
                              }
                              onPress={() =>
                                toggleFavoritoActividad(
                                  actividad.nombre
                                )
                              }
                            >
                              <Text
                                style={
                                  styles.favoritoEmoji
                                }
                              >
                                {favorito
                                  ? '❤️'
                                  : '🤍'}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <Text
                            style={
                              styles.itemDescripcion
                            }
                          >
                            {
                              actividad.descripcion
                            }
                          </Text>

                          <View
                            style={
                              styles.chipsFila
                            }
                          >
                            <View
                              style={
                                styles.chip
                              }
                            >
                              <Text
                                style={
                                  styles.chipTexto
                                }
                              >
                                ⏱️{' '}
                                {
                                  actividad.duracion
                                }
                              </Text>
                            </View>

                            <View
                              style={
                                styles.chip
                              }
                            >
                              <Text
                                style={
                                  styles.chipTexto
                                }
                              >
                                💲$
                                {dinero(
                                  actividad.precio
                                )}
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={
                              styles.nota
                            }
                          >
                            Precio
                            aproximado por
                            persona
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* =====================================
                RESTAURANTES
            ===================================== */}

            <View
              style={styles.seccion}
            >
              <View
                style={
                  styles.seccionHeader
                }
              >
                <View>
                  <Text
                    style={
                      styles.seccionTitulo
                    }
                  >
                    🍽️ Restaurantes
                  </Text>

                  <Text
                    style={
                      styles.seccionTexto
                    }
                  >
                    Revisa el tipo de
                    comida y algunas
                    opciones del menú.
                  </Text>
                </View>
              </View>

              {zona.restaurantes.map(
                (restaurante) => {
                  const favorito =
                    favoritosRestaurantes.includes(
                      restaurante.nombre
                    );

                  return (
                    <View
                      key={
                        restaurante.nombre
                      }
                      style={
                        styles.itemCard
                      }
                    >
                      <View
                        style={[
                          styles.itemPrincipal,

                          esMovil &&
                            styles.itemPrincipalMovil,
                        ]}
                      >
                        {/* IMAGEN */}

                        {restaurante.imagen ? (
                          <Image
                            source={
                              typeof restaurante.imagen ===
                              'string'
                                ? {
                                    uri:
                                      restaurante.imagen,
                                  }
                                : restaurante.imagen
                            }
                            style={[
                              styles.imagenItem,

                              esMovil &&
                                styles.imagenItemMovil,
                            ]}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.imagenPlaceholderRestaurante,

                              esMovil &&
                                styles.imagenItemMovil,
                            ]}
                          >
                            <Text
                              style={
                                styles.placeholderEmoji
                              }
                            >
                              {
                                restaurante.emoji
                              }
                            </Text>

                            <Text
                              style={
                                styles.placeholderTexto
                              }
                            >
                              Restaurante
                            </Text>
                          </View>
                        )}

                        {/* INFO */}

                        <View
                          style={[
                            styles.infoItem,

                            esMovil &&
                              styles.infoItemMovil,
                          ]}
                        >
                          <View
                            style={
                              styles.itemTituloFila
                            }
                          >
                            <View
                              style={{
                                flex: 1,
                              }}
                            >
                              <Text
                                style={
                                  styles.itemTipo
                                }
                              >
                                {
                                  restaurante.tipo
                                }
                              </Text>

                              <Text
                                style={
                                  styles.itemNombre
                                }
                              >
                                {
                                  restaurante.nombre
                                }
                              </Text>

                              <Text
                                style={
                                  styles.calificacion
                                }
                              >
                                ⭐{' '}
                                {
                                  restaurante.calificacion
                                }
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={
                                styles.favorito
                              }
                              onPress={() =>
                                toggleFavoritoRestaurante(
                                  restaurante.nombre
                                )
                              }
                            >
                              <Text
                                style={
                                  styles.favoritoEmoji
                                }
                              >
                                {favorito
                                  ? '❤️'
                                  : '🤍'}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <Text
                            style={
                              styles.itemDescripcion
                            }
                          >
                            {
                              restaurante.descripcion
                            }
                          </Text>

                          <View
                            style={
                              styles.menuCaja
                            }
                          >
                            <Text
                              style={
                                styles.menuTitulo
                              }
                            >
                              🍴 Menú
                            </Text>

                            <Text
                              style={
                                styles.menuTexto
                              }
                            >
                              {
                                restaurante.menu
                              }
                            </Text>
                          </View>

                          <View
                            style={
                              styles.chipsFila
                            }
                          >
                            <View
                              style={
                                styles.chip
                              }
                            >
                              <Text
                                style={
                                  styles.chipTexto
                                }
                              >
                                💲$
                                {dinero(
                                  restaurante.precioPromedio
                                )}{' '}
                                aprox.
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={
                              styles.nota
                            }
                          >
                            Consumo
                            aproximado por
                            persona
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* =====================================
                LUGARES DESTACADOS
            ===================================== */}

            <View
              style={styles.seccion}
            >
              <View
                style={
                  styles.seccionHeader
                }
              >
                <View>
                  <Text
                    style={
                      styles.seccionTitulo
                    }
                  >
                    🏛️ Lugares destacados
                  </Text>

                  <Text
                    style={
                      styles.seccionTexto
                    }
                  >
                    Algunos sitios que
                    puedes conocer en la
                    zona.
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.lugaresCard
                }
              >
                {zona.lugares.map(
                  (
                    lugar,
                    index
                  ) => (
                    <View
                      key={lugar}
                      style={[
                        styles.lugarFila,

                        index !==
                          zona.lugares
                            .length -
                            1 &&
                          styles.lugarSeparador,
                      ]}
                    >
                      <View
                        style={
                          styles.lugarNumero
                        }
                      >
                        <Text
                          style={
                            styles.lugarNumeroTexto
                          }
                        >
                          {index + 1}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.lugarTexto
                        }
                      >
                        {lugar}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* =====================================
          BARRA INFERIOR
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
            style={
              styles.navEmoji
            }
          >
            🏠
          </Text>

          <Text
            style={
              styles.navTexto
            }
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
            style={
              styles.navEmoji
            }
          >
            🔍
          </Text>

          <Text
            style={
              styles.navTexto
            }
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
            style={
              styles.navEmoji
            }
          >
            🧳
          </Text>

          <Text
            style={
              styles.navTexto
            }
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
            style={
              styles.navEmoji
            }
          >
            👤
          </Text>

          <Text
            style={
              styles.navTexto
            }
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
      paddingBottom: 110,
    },

    /* HEADER */

    header: {
      width: '100%',

      maxWidth: 1000,

      alignSelf: 'center',

      paddingHorizontal: 25,

      paddingTop: 25,

      flexDirection: 'row',

      alignItems: 'center',
    },

    regresar: {
      width: 44,
      height: 44,

      borderRadius: 22,

      marginRight: 15,

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

    logo: {
      fontSize: 27,

      fontWeight: '900',

      letterSpacing: 4,

      color: '#087F8C',
    },

    subtitulo: {
      fontSize: 12,

      color: '#748589',
    },

    /* PRESENTACIÓN */

    presentacion: {
      width: '100%',

      maxWidth: 1000,

      alignSelf: 'center',

      paddingHorizontal: 25,

      marginTop: 27,
    },

    etiqueta: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    titulo: {
      marginTop: 5,

      fontSize: 27,

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

    /* ZONA */

    zonaContenedor: {
      width: '90%',

      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 28,

      marginBottom: 15,
    },

    zonaEncabezado: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    zonaEmojiCaja: {
      width: 58,

      height: 58,

      marginRight: 14,

      borderRadius: 20,

      backgroundColor:
        '#E2F2F1',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    zonaEmoji: {
      fontSize: 29,
    },

    zonaEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    zonaNombre: {
      marginTop: 3,

      fontSize: 24,

      fontWeight: '900',

      color: '#203438',
    },

    estado: {
      marginTop: 3,

      fontSize: 9,

      color: '#899699',
    },

    resumen: {
      marginTop: 17,

      maxWidth: 800,

      fontSize: 11,

      lineHeight: 18,

      color: '#53666A',
    },

    /* SECCIONES */

    seccion: {
      marginTop: 28,
    },

    seccionHeader: {
      marginBottom: 12,
    },

    seccionTitulo: {
      fontSize: 18,

      fontWeight: '900',

      color: '#203438',
    },

    seccionTexto: {
      marginTop: 4,

      fontSize: 10,

      color: '#899699',
    },

    /* HOTEL */

    hotelCard: {
      padding: 18,

      borderRadius: 23,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      flexWrap: 'wrap',

      gap: 10,
    },

    hotelEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      color: '#087F8C',
    },

    hotelNombre: {
      marginTop: 4,

      fontSize: 16,

      fontWeight: '900',

      color: '#203438',
    },

    hotelPrecio: {
      marginTop: 5,

      fontSize: 10,

      fontWeight: '800',

      color: '#087F8C',
    },

    botonHospedajes: {
      paddingHorizontal: 18,

      paddingVertical: 12,

      borderRadius: 18,

      backgroundColor:
        '#087F8C',
    },

    botonHospedajesTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    /* TARJETAS */

    itemCard: {
      marginBottom: 15,

      padding: 16,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',
    },

    itemPrincipal: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    itemPrincipalMovil: {
      flexDirection: 'column',
    },

    /* IMAGEN */

    imagenItem: {
      width: 175,

      height: 175,

      minWidth: 175,

      maxWidth: 175,

      minHeight: 175,

      maxHeight: 175,

      borderRadius: 20,

      backgroundColor:
        '#DDEEEB',
    },

    imagenItemMovil: {
      width: '100%',

      maxWidth: '100%',

      minWidth: '100%',

      height: 210,

      minHeight: 210,

      maxHeight: 210,
    },

    imagenPlaceholder: {
      width: 175,

      height: 175,

      minWidth: 175,

      maxWidth: 175,

      minHeight: 175,

      maxHeight: 175,

      borderRadius: 20,

      backgroundColor:
        '#DDEEEB',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    imagenPlaceholderRestaurante: {
      width: 175,

      height: 175,

      minWidth: 175,

      maxWidth: 175,

      minHeight: 175,

      maxHeight: 175,

      borderRadius: 20,

      backgroundColor:
        '#EEE8DD',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    placeholderEmoji: {
      fontSize: 44,
    },

    placeholderTexto: {
      marginTop: 6,

      fontSize: 8,

      color: '#748589',
    },

    /* INFORMACIÓN */

    infoItem: {
      flex: 1,

      minWidth: 0,

      paddingLeft: 18,
    },

    infoItemMovil: {
      width: '100%',

      paddingLeft: 0,

      paddingTop: 16,
    },

    itemTituloFila: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    itemTipo: {
      fontSize: 8,

      fontWeight: '900',

      textTransform:
        'uppercase',

      color: '#087F8C',
    },

    itemNombre: {
      marginTop: 5,

      fontSize: 17,

      lineHeight: 21,

      fontWeight: '900',

      color: '#203438',
    },

    itemDescripcion: {
      marginTop: 9,

      fontSize: 10,

      lineHeight: 16,

      color: '#53666A',
    },

    calificacion: {
      marginTop: 5,

      fontSize: 9,

      fontWeight: '800',

      color: '#53666A',
    },

    favorito: {
      width: 38,

      height: 38,

      marginLeft: 8,

      borderRadius: 19,

      backgroundColor:
        '#F5F9F8',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    favoritoEmoji: {
      fontSize: 18,
    },

    chipsFila: {
      marginTop: 12,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    chip: {
      marginRight: 7,

      marginBottom: 5,

      paddingHorizontal: 10,

      paddingVertical: 7,

      borderRadius: 15,

      backgroundColor:
        '#EAF5F3',
    },

    chipTexto: {
      fontSize: 9,

      fontWeight: '800',

      color: '#087F8C',
    },

    nota: {
      marginTop: 3,

      fontSize: 8,

      color: '#899699',
    },

    /* MENÚ */

    menuCaja: {
      marginTop: 11,

      padding: 11,

      borderRadius: 15,

      backgroundColor:
        '#F5F9F8',
    },

    menuTitulo: {
      fontSize: 9,

      fontWeight: '900',

      color: '#203438',
    },

    menuTexto: {
      marginTop: 5,

      fontSize: 9,

      lineHeight: 15,

      color: '#53666A',
    },

    /* LUGARES */

    lugaresCard: {
      paddingHorizontal: 17,

      borderRadius: 23,

      backgroundColor:
        '#FFFFFF',
    },

    lugarFila: {
      paddingVertical: 14,

      flexDirection: 'row',

      alignItems: 'center',
    },

    lugarSeparador: {
      borderBottomWidth: 1,

      borderBottomColor:
        '#E7EEEE',
    },

    lugarNumero: {
      width: 30,

      height: 30,

      marginRight: 12,

      borderRadius: 15,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    lugarNumeroTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    lugarTexto: {
      flex: 1,

      fontSize: 10,

      fontWeight: '700',

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
  });
