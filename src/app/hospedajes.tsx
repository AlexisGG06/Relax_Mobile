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

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';


import { useCatalogos } from '../context/CatalogosContext';

/* =========================================
   ZONAS
========================================= */

const FILTROS_ZONA = [
  'Todos',
  'Huasca de Ocampo',
  'Real del Monte',
  'Mineral del Chico',
];

/* =========================================
   PANTALLA
========================================= */

export default function HospedajesScreen() {
  const { hospedajes: HOSPEDAJES } = useCatalogos();
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  const params =
    useLocalSearchParams<{
      zona?: string;
    }>();

  const zonaInicial =
    params.zona &&
    FILTROS_ZONA.includes(
      params.zona
    )
      ? params.zona
      : 'Todos';

  const zonaSeleccionada = zonaInicial;
  const setZonaSeleccionada = (zona: string) => router.setParams({ zona });

  const hospedajesFiltrados =
    zonaSeleccionada === 'Todos'
      ? HOSPEDAJES
      : HOSPEDAJES.filter(
          (hospedaje) =>
            hospedaje.zona ===
            zonaSeleccionada
        );

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
              Hospedajes
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
            HOSPEDAJES EN HIDALGO
          </Text>

          <Text style={styles.titulo}>
            Encuentra tu estancia
          </Text>

          <Text
            style={
              styles.descripcionPagina
            }
          >
            Explora hoteles, posadas y
            cabañas disponibles en cada
            zona y consulta sus
            características antes de
            reservar.
          </Text>
        </View>

        {/* =====================================
            FILTROS
        ===================================== */}

        <View
          style={
            styles.filtrosContenedor
          }
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.filtros
            }
          >
            {FILTROS_ZONA.map(
              (zona) => {
                const activa =
                  zonaSeleccionada ===
                  zona;

                return (
                  <TouchableOpacity
                    key={zona}
                    style={[
                      styles.filtroBoton,

                      activa &&
                        styles.filtroActivo,
                    ]}
                    onPress={() =>
                      setZonaSeleccionada(
                        zona
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filtroTexto,

                        activa &&
                          styles.filtroTextoActivo,
                      ]}
                    >
                      {zona ===
                      'Huasca de Ocampo'
                        ? 'Huasca'
                        : zona}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        </View>

        {/* =====================================
            RESULTADOS
        ===================================== */}

        <View
          style={
            styles.resultadosHeader
          }
        >
          <Text
            style={
              styles.resultadosTitulo
            }
          >
            {zonaSeleccionada ===
            'Todos'
              ? 'Hospedajes disponibles'
              : zonaSeleccionada}
          </Text>

          <Text
            style={
              styles.resultadosNumero
            }
          >
            {
              hospedajesFiltrados.length
            }{' '}
            opciones
          </Text>
        </View>

        {/* =====================================
            HOSPEDAJES
        ===================================== */}

        {hospedajesFiltrados.map(
          (hospedaje) => (
            <View
              key={hospedaje.id}
              style={styles.card}
            >
              <View
                style={[
                  styles.cardPrincipal,

                  esMovil &&
                    styles.cardPrincipalMovil,
                ]}
              >
                {/* IMAGEN */}

                <View
                  style={[
                    styles.imagenContenedor,

                    esMovil &&
                      styles.imagenContenedorMovil,
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        hospedaje
                          .imagenes[0],
                    }}
                    style={[
                      styles.imagen,

                      esMovil &&
                        styles.imagenMovil,
                    ]}
                    resizeMode="cover"
                  />

                  <View
                    style={
                      styles.calificacionCaja
                    }
                  >
                    <Text
                      style={
                        styles.calificacionTexto
                      }
                    >
                      ⭐{' '}
                      {
                        hospedaje.calificacion
                      }
                    </Text>
                  </View>
                </View>

                {/* INFORMACIÓN */}

                <View
                  style={[
                    styles.infoHospedaje,

                    esMovil &&
                      styles.infoHospedajeMovil,
                  ]}
                >
                  <Text
                    style={styles.tipo}
                  >
                    {hospedaje.tipo}
                  </Text>

                  <Text
                    style={styles.nombre}
                  >
                    {hospedaje.nombre}
                  </Text>

                  <Text
                    style={
                      styles.ubicacion
                    }
                  >
                    📍{' '}
                    {
                      hospedaje.ubicacion
                    }
                  </Text>

                  <Text
                    style={
                      styles.descripcion
                    }
                    numberOfLines={
                      esMovil
                        ? 4
                        : 3
                    }
                  >
                    {
                      hospedaje.descripcion
                    }
                  </Text>

                  {/* HABITACIÓN */}

                  <View
                    style={
                      styles.habitacionCaja
                    }
                  >
                    <Text
                      style={
                        styles.habitacionTitulo
                      }
                    >
                      🛏️{' '}
                      {
                        hospedaje.habitacion
                      }
                    </Text>
                  </View>

                  {/* CAPACIDAD */}

                  <View
                    style={
                      styles.infoFila
                    }
                  >
                    <View
                      style={
                        styles.infoChip
                      }
                    >
                      <Text
                        style={
                          styles.infoChipTexto
                        }
                      >
                        👥{' '}
                        {
                          hospedaje.capacidad
                        }{' '}
                        personas
                      </Text>
                    </View>

                    <View
                      style={
                        styles.infoChip
                      }
                    >
                      <Text
                        style={
                          styles.infoChipTexto
                        }
                      >
                        🛏️{' '}
                        {
                          hospedaje.camas
                        }{' '}
                        camas
                      </Text>
                    </View>

                    <View
                      style={
                        styles.infoChip
                      }
                    >
                      <Text
                        style={
                          styles.infoChipTexto
                        }
                      >
                        🚿{' '}
                        {
                          hospedaje.banos
                        }{' '}
                        baño
                        {hospedaje.banos >
                        1
                          ? 's'
                          : ''}
                      </Text>
                    </View>
                  </View>

                  {/* SERVICIOS */}

                  <View
                    style={
                      styles.servicios
                    }
                  >
                    {hospedaje.servicios
                      .slice(0, 4)
                      .map(
                        (servicio) => (
                          <View
                            key={
                              servicio
                            }
                            style={
                              styles.servicioChip
                            }
                          >
                            <Text
                              style={
                                styles.servicioTexto
                              }
                            >
                              ✓{' '}
                              {
                                servicio
                              }
                            </Text>
                          </View>
                        )
                      )}
                  </View>

                  {hospedaje.servicios
                    .length > 4 && (
                    <Text
                      style={
                        styles.masServicios
                      }
                    >
                      +{' '}
                      {hospedaje
                        .servicios
                        .length - 4}{' '}
                      servicios más
                    </Text>
                  )}

                  {/* PRECIO */}

                  <View
                    style={
                      styles.precioFila
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.precioEtiqueta
                        }
                      >
                        Desde
                      </Text>

                      <Text
                        style={
                          styles.precio
                        }
                      >
                        $
                        {dinero(
                          hospedaje.precio
                        )}

                        <Text
                          style={
                            styles.noche
                          }
                        >
                          {' '}
                          / noche
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={
                        styles.boton
                      }
                      onPress={() =>
                        router.push({
                          pathname:
                            '/detalle-hospedaje',

                          params: {
                            id:
                              hospedaje.id,
                          },
                        } as any)
                      }
                    >
                      <Text
                        style={
                          styles.botonTexto
                        }
                      >
                        Ver hospedaje
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )
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

    scroll: {
      paddingBottom: 55,
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
      marginTop: 7,

      maxWidth: 650,

      fontSize: 12,

      lineHeight: 18,

      color: '#748589',
    },

    /* FILTROS */

    filtrosContenedor: {
      width: '100%',

      maxWidth: 1000,

      alignSelf: 'center',
    },

    filtros: {
      paddingHorizontal: 25,

      paddingTop: 24,

      paddingBottom: 5,
    },

    filtroBoton: {
      marginRight: 9,

      paddingHorizontal: 17,

      paddingVertical: 10,

      borderRadius: 18,

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,

      borderColor:
        '#DDE8E6',
    },

    filtroActivo: {
      backgroundColor:
        '#087F8C',

      borderColor:
        '#087F8C',
    },

    filtroTexto: {
      fontSize: 10,

      fontWeight: '800',

      color: '#53666A',
    },

    filtroTextoActivo: {
      color: '#FFFFFF',
    },

    /* RESULTADOS */

    resultadosHeader: {
      width: '100%',

      maxWidth: 950,

      alignSelf: 'center',

      paddingHorizontal: 25,

      marginTop: 24,
    },

    resultadosTitulo: {
      fontSize: 19,

      fontWeight: '900',

      color: '#203438',
    },

    resultadosNumero: {
      marginTop: 4,

      fontSize: 10,

      color: '#899699',
    },

    /* TARJETA */

    card: {
      width: '90%',

      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 18,

      padding: 18,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    cardPrincipal: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    cardPrincipalMovil: {
      flexDirection: 'column',
    },

    /* IMAGEN */

    imagenContenedor: {
      position: 'relative',

      width: 250,

      height: 250,

      minWidth: 250,

      maxWidth: 250,

      minHeight: 250,

      maxHeight: 250,

      borderRadius: 20,

      overflow: 'hidden',

      backgroundColor:
        '#DDEEEB',
    },

    imagenContenedorMovil: {
      width: '100%',

      maxWidth: '100%',

      minWidth: '100%',

      height: 220,

      minHeight: 220,

      maxHeight: 220,
    },

    imagen: {
      width: 250,

      height: 250,
    },

    imagenMovil: {
      width: '100%',

      height: 220,
    },

    calificacionCaja: {
      position: 'absolute',

      top: 12,

      right: 12,

      paddingHorizontal: 10,

      paddingVertical: 7,

      borderRadius: 15,

      backgroundColor:
        'rgba(255,255,255,0.94)',
    },

    calificacionTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#203438',
    },

    /* INFORMACIÓN */

    infoHospedaje: {
      flex: 1,

      minWidth: 0,

      paddingLeft: 20,
    },

    infoHospedajeMovil: {
      width: '100%',

      paddingLeft: 0,

      paddingTop: 18,
    },

    tipo: {
      fontSize: 9,

      fontWeight: '900',

      textTransform:
        'uppercase',

      color: '#087F8C',
    },

    nombre: {
      marginTop: 5,

      fontSize: 20,

      lineHeight: 24,

      fontWeight: '900',

      color: '#203438',
    },

    ubicacion: {
      marginTop: 6,

      fontSize: 10,

      color: '#748589',
    },

    descripcion: {
      marginTop: 10,

      fontSize: 10,

      lineHeight: 16,

      color: '#53666A',
    },

    /* HABITACIÓN */

    habitacionCaja: {
      alignSelf: 'flex-start',

      marginTop: 12,

      paddingHorizontal: 10,

      paddingVertical: 7,

      borderRadius: 15,

      backgroundColor:
        '#F5F9F8',
    },

    habitacionTitulo: {
      fontSize: 9,

      fontWeight: '800',

      color: '#53666A',
    },

    /* INFORMACIÓN */

    infoFila: {
      marginTop: 12,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    infoChip: {
      marginRight: 7,

      marginBottom: 6,

      paddingHorizontal: 9,

      paddingVertical: 7,

      borderRadius: 14,

      backgroundColor:
        '#EAF5F3',
    },

    infoChipTexto: {
      fontSize: 8,

      fontWeight: '800',

      color: '#087F8C',
    },

    /* SERVICIOS */

    servicios: {
      marginTop: 8,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    servicioChip: {
      marginRight: 6,

      marginBottom: 6,

      paddingHorizontal: 8,

      paddingVertical: 6,

      borderRadius: 13,

      backgroundColor:
        '#F5F9F8',
    },

    servicioTexto: {
      fontSize: 8,

      fontWeight: '700',

      color: '#53666A',
    },

    masServicios: {
      marginTop: 1,

      fontSize: 8,

      color: '#899699',
    },

    /* PRECIO */

    precioFila: {
      marginTop: 15,

      paddingTop: 14,

      borderTopWidth: 1,

      borderTopColor:
        '#E7EEEE',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      flexWrap: 'wrap',

      gap: 10,
    },

    precioEtiqueta: {
      fontSize: 8,

      color: '#899699',
    },

    precio: {
      marginTop: 2,

      fontSize: 21,

      fontWeight: '900',

      color: '#087F8C',
    },

    noche: {
      fontSize: 9,

      fontWeight: '500',

      color: '#748589',
    },

    /* BOTÓN */

    boton: {
      paddingHorizontal: 20,

      paddingVertical: 13,

      borderRadius: 18,

      backgroundColor:
        '#087F8C',

      alignItems: 'center',

      justifyContent:
        'center',
    },

    botonTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#FFFFFF',
    },
  });
