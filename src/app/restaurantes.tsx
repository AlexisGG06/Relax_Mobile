import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useCatalogos } from '../context/CatalogosContext';

import {
  Restaurante,
  useViaje,
} from '../context/ViajeContext';

/* =========================================
   RESTAURANTES DESDE ZONAS
========================================= */


/* =========================================
   FECHAS
========================================= */

function convertirFecha(
  fecha?: string
) {
  if (!fecha) {
    return null;
  }

  const partes =
    fecha.split('/');

  if (partes.length !== 3) {
    return null;
  }

  return new Date(
    Number(partes[2]),
    Number(partes[1]) - 1,
    Number(partes[0])
  );
}

function formatearFecha(
  fecha: Date
) {
  const dia = fecha
    .getDate()
    .toString()
    .padStart(2, '0');

  const mes = (
    fecha.getMonth() + 1
  )
    .toString()
    .padStart(2, '0');

  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

function obtenerDias(
  llegada?: string,
  salida?: string
) {
  const inicio =
    convertirFecha(llegada);

  const fin =
    convertirFecha(salida);

  if (!inicio || !fin) {
    return [];
  }

  const dias: string[] = [];

  const actual =
    new Date(inicio);

  while (actual < fin) {
    dias.push(
      formatearFecha(actual)
    );

    actual.setDate(
      actual.getDate() + 1
    );
  }

  return dias;
}

/* =========================================
   PANTALLA
========================================= */

export default function RestaurantesScreen() {
  const { zonas } = useCatalogos();
  const RESTAURANTES = zonas.flatMap((zona) => zona.restaurantes.map((restaurante) => ({ ...restaurante, ubicacion: zona.nombre })));
  const router = useRouter();

  const {
    hospedaje,
    restaurantes,
    agregarRestaurante,
    favoritosRestaurantes,
    toggleFavoritoRestaurante,
  } = useViaje();

  const zona =
    hospedaje?.ubicacion || '';

  const dias =
    obtenerDias(
      hospedaje?.fechaLlegada,
      hospedaje?.fechaSalida
    );

  const restaurantesZona =
    RESTAURANTES.filter(
      (restaurante) =>
        restaurante.ubicacion ===
        zona
    );

  const favoritos =
    restaurantesZona.filter(
      (restaurante) =>
        favoritosRestaurantes.includes(
          restaurante.nombre
        )
    );

  const restantes =
    restaurantesZona.filter(
      (restaurante) =>
        !favoritosRestaurantes.includes(
          restaurante.nombre
        )
    );

  const [
    fechasElegidas,
    setFechasElegidas,
  ] = useState<{
    [key: string]: string;
  }>(() => {
    const inicial: {
      [key: string]: string;
    } = {};

    restaurantes.forEach(
      (restaurante) => {
        inicial[
          restaurante.nombre
        ] =
          restaurante.fecha;
      }
    );

    return inicial;
  });

  const estaAgregado = (
    nombre: string
  ) => {
    return restaurantes.some(
      (restaurante) =>
        restaurante.nombre ===
        nombre
    );
  };

  const guardarRestaurante = (
    opcion:
      (typeof RESTAURANTES)[number]
  ) => {
    const fecha =
      fechasElegidas[
        opcion.nombre
      ];

    if (!fecha) {
      return;
    }

    const nuevoRestaurante: Restaurante =
      {
        nombre:
          opcion.nombre,

        ubicacion:
          opcion.ubicacion,

        tipo:
          opcion.tipo,

        calificacion:
          opcion.calificacion.toString(),

        fecha,
      };

    agregarRestaurante(
      nuevoRestaurante
    );
  };

  /* =========================================
     TARJETA RESTAURANTE
  ========================================= */

  const renderRestaurante = (
    restaurante:
      (typeof RESTAURANTES)[number]
  ) => {
    const favorito =
      favoritosRestaurantes.includes(
        restaurante.nombre
      );

    const agregado =
      estaAgregado(
        restaurante.nombre
      );

    const fecha =
      fechasElegidas[
        restaurante.nombre
      ];

    return (
      <View
        key={restaurante.nombre}
        style={styles.card}
      >
        {/* PARTE SUPERIOR */}

        <View
          style={
            styles.restaurantePrincipal
          }
        >
          {/* IMAGEN IZQUIERDA */}

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
              style={
                styles.imagenRestaurante
              }
              resizeMode="cover"
            />
          ) : (
            <View
              style={
                styles.imagenPlaceholder
              }
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

          {/* INFORMACIÓN */}

          <View
            style={
              styles.infoRestaurante
            }
          >
            <View
              style={styles.tipoFila}
            >
              <Text
                style={styles.tipo}
              >
                {restaurante.tipo}
              </Text>

              <TouchableOpacity
                style={styles.corazon}
                onPress={() =>
                  toggleFavoritoRestaurante(
                    restaurante.nombre
                  )
                }
              >
                <Text
                  style={
                    styles.corazonTexto
                  }
                >
                  {favorito
                    ? '❤️'
                    : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={styles.nombre}
            >
              {restaurante.nombre}
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

            <Text
              style={
                styles.descripcionRestaurante
              }
            >
              {
                restaurante.descripcion
              }
            </Text>

            <View
              style={
                styles.precioChip
              }
            >
              <Text
                style={
                  styles.precioChipTexto
                }
              >
                💲$
                {restaurante.precioPromedio.toLocaleString(
                  'es-MX'
                )}{' '}
                aprox.
              </Text>
            </View>
          </View>
        </View>

        {/* MENÚ */}

        <View
          style={styles.separador}
        />

        <View
          style={styles.menuCaja}
        >
          <Text
            style={styles.menuTitulo}
          >
            🍴 Menú / qué puedes encontrar
          </Text>

          <Text
            style={styles.menuTexto}
          >
            {restaurante.menu}
          </Text>
        </View>

        {/* FECHA */}

        <Text style={styles.label}>
          📅 ¿Qué día quieres ir?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={styles.fechasScroll}
        >
          {dias.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.fechaBoton,

                fecha === dia &&
                  styles.fechaActiva,
              ]}
              onPress={() =>
                setFechasElegidas(
                  (actual) => ({
                    ...actual,

                    [restaurante.nombre]:
                      dia,
                  })
                )
              }
            >
              <Text
                style={[
                  styles.fechaTexto,

                  fecha === dia &&
                    styles.fechaTextoActiva,
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BOTÓN */}

        <TouchableOpacity
          disabled={!fecha}
          style={[
            styles.boton,

            agregado &&
              styles.botonAgregado,

            !fecha &&
              styles.botonDeshabilitado,
          ]}
          onPress={() =>
            guardarRestaurante(
              restaurante
            )
          }
        >
          <Text
            style={styles.botonTexto}
          >
            {!fecha
              ? 'Selecciona un día'
              : agregado
              ? '✓ Actualizar restaurante'
              : '+ Agregar a Mi viaje'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

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
              Restaurantes
            </Text>
          </View>
        </View>

        {/* SIN HOTEL */}

        {!hospedaje ? (
          <View
            style={
              styles.sinHospedaje
            }
          >
            <Text
              style={styles.sinEmoji}
            >
              🏨
            </Text>

            <Text
              style={styles.sinTitulo}
            >
              Primero reserva un
              hospedaje
            </Text>

            <Text
              style={styles.sinTexto}
            >
              Después aparecerán los
              restaurantes correspondientes
              a esa zona.
            </Text>

            <TouchableOpacity
              style={styles.boton}
              onPress={() =>
                router.push(
                  '/hospedajes' as any
                )
              }
            >
              <Text
                style={
                  styles.botonTexto
                }
              >
                Ver hospedajes
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* PRESENTACIÓN */}

            <View
              style={
                styles.presentacion
              }
            >
              <Text
                style={styles.etiqueta}
              >
                RESTAURANTES EN
              </Text>

              <Text
                style={styles.titulo}
              >
                {zona}
              </Text>

              <Text
                style={
                  styles.descripcionPagina
                }
              >
                Conoce restaurantes,
                cafeterías y opciones de
                comida cerca de tu
                hospedaje.
              </Text>
            </View>

            {/* FAVORITOS */}

            {favoritos.length > 0 && (
              <>
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
                    ❤️ Tus favoritos
                  </Text>

                  <Text
                    style={
                      styles.seccionTexto
                    }
                  >
                    Coinciden con tu
                    hospedaje en {zona}
                  </Text>
                </View>

                {favoritos.map(
                  renderRestaurante
                )}
              </>
            )}

            {/* RESTANTES */}

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
                {favoritos.length > 0
                  ? 'Más restaurantes'
                  : 'Restaurantes disponibles'}
              </Text>

              <Text
                style={
                  styles.seccionTexto
                }
              >
                {restantes.length}{' '}
                opciones
              </Text>
            </View>

            {restantes.map(
              renderRestaurante
            )}
          </>
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
      backgroundColor: '#F5F9F8',
    },

    scroll: {
      paddingBottom: 50,
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

      backgroundColor: '#FFFFFF',

      justifyContent: 'center',
      alignItems: 'center',
    },

    regresarTexto: {
      fontSize: 33,
      color: '#203438',
      marginTop: -5,
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
      color: '#087F8C',
      letterSpacing: 1,
    },

    titulo: {
      marginTop: 5,

      fontSize: 27,
      fontWeight: '900',

      color: '#203438',
    },

    descripcionPagina: {
      marginTop: 7,

      fontSize: 12,
      lineHeight: 18,

      color: '#748589',
    },

    /* SECCIONES */

    seccionHeader: {
      width: '100%',
      maxWidth: 950,
      alignSelf: 'center',

      marginTop: 27,

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

    /* TARJETA */

    card: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 18,

      padding: 18,

      borderRadius: 25,

      backgroundColor: '#FFFFFF',
    },

    restaurantePrincipal: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    /* IMAGEN IZQUIERDA */

    imagenRestaurante: {
      width: 175,
      height: 175,

      minWidth: 175,
      maxWidth: 175,

      minHeight: 175,
      maxHeight: 175,

      borderRadius: 20,

      backgroundColor: '#EEE8DD',
    },

    imagenPlaceholder: {
      width: 175,
      height: 175,

      minWidth: 175,
      maxWidth: 175,

      minHeight: 175,
      maxHeight: 175,

      borderRadius: 20,

      backgroundColor: '#EEE8DD',

      justifyContent: 'center',
      alignItems: 'center',
    },

    placeholderEmoji: {
      fontSize: 45,
    },

    placeholderTexto: {
      marginTop: 6,

      fontSize: 9,

      color: '#748589',
    },

    /* INFORMACIÓN DERECHA */

    infoRestaurante: {
      flex: 1,

      paddingLeft: 18,

      minWidth: 0,
    },

    tipoFila: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    tipo: {
      flex: 1,

      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',

      textTransform: 'uppercase',
    },

    nombre: {
      marginTop: 6,

      fontSize: 18,

      lineHeight: 22,

      fontWeight: '900',

      color: '#203438',
    },

    calificacion: {
      marginTop: 5,

      fontSize: 10,

      fontWeight: '800',

      color: '#53666A',
    },

    descripcionRestaurante: {
      marginTop: 9,

      fontSize: 10,

      lineHeight: 15,

      color: '#53666A',
    },

    corazon: {
      width: 38,
      height: 38,

      marginLeft: 8,

      borderRadius: 19,

      backgroundColor: '#F5F9F8',

      justifyContent: 'center',
      alignItems: 'center',
    },

    corazonTexto: {
      fontSize: 18,
    },

    precioChip: {
      alignSelf: 'flex-start',

      marginTop: 13,

      paddingHorizontal: 10,
      paddingVertical: 7,

      borderRadius: 15,

      backgroundColor: '#EAF5F3',
    },

    precioChipTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    /* MENÚ */

    separador: {
      height: 1,

      marginTop: 18,

      backgroundColor: '#E7EEEE',
    },

    menuCaja: {
      marginTop: 17,

      padding: 14,

      borderRadius: 17,

      backgroundColor: '#F5F9F8',
    },

    menuTitulo: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    menuTexto: {
      marginTop: 7,

      fontSize: 10,

      lineHeight: 17,

      color: '#53666A',
    },

    /* FECHA */

    label: {
      marginTop: 18,

      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    fechasScroll: {
      marginTop: 9,
    },

    fechaBoton: {
      marginRight: 8,

      paddingHorizontal: 13,
      paddingVertical: 10,

      borderRadius: 17,

      backgroundColor: '#F5F9F8',
    },

    fechaActiva: {
      backgroundColor: '#087F8C',
    },

    fechaTexto: {
      fontSize: 10,

      fontWeight: '800',

      color: '#53666A',
    },

    fechaTextoActiva: {
      color: '#FFFFFF',
    },

    /* BOTÓN */

    boton: {
      marginTop: 19,

      paddingVertical: 14,

      borderRadius: 20,

      backgroundColor: '#087F8C',

      alignItems: 'center',
    },

    botonAgregado: {
      backgroundColor: '#073F46',
    },

    botonDeshabilitado: {
      opacity: 0.4,
    },

    botonTexto: {
      color: '#FFFFFF',

      fontSize: 11,

      fontWeight: '900',
    },

    /* SIN HOTEL */

    sinHospedaje: {
      width: '90%',
      maxWidth: 700,

      alignSelf: 'center',

      marginTop: 35,

      padding: 28,

      borderRadius: 24,

      backgroundColor: '#FFFFFF',

      alignItems: 'center',
    },

    sinEmoji: {
      fontSize: 50,
    },

    sinTitulo: {
      marginTop: 13,

      fontSize: 18,

      fontWeight: '900',

      color: '#203438',

      textAlign: 'center',
    },

    sinTexto: {
      marginTop: 8,

      fontSize: 12,

      lineHeight: 18,

      color: '#748589',

      textAlign: 'center',
    },
  });
