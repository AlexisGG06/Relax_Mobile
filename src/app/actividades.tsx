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
  Actividad,
  useViaje,
} from '../context/ViajeContext';

/* =========================================
   ACTIVIDADES DESDE ZONAS
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

export default function ActividadesScreen() {
  const { zonas } = useCatalogos();
  const ACTIVIDADES = zonas.flatMap((zona) => zona.actividades.map((actividad) => ({ ...actividad, ubicacion: zona.nombre })));
  const router = useRouter();

  const {
    hospedaje,
    actividades,
    agregarActividad,
    favoritosActividades,
    toggleFavoritoActividad,
  } = useViaje();

  const zona =
    hospedaje?.ubicacion || '';

  const dias =
    obtenerDias(
      hospedaje?.fechaLlegada,
      hospedaje?.fechaSalida
    );

  const actividadesZona =
    ACTIVIDADES.filter(
      (actividad) =>
        actividad.ubicacion ===
        zona
    );

  const favoritas =
    actividadesZona.filter(
      (actividad) =>
        favoritosActividades.includes(
          actividad.nombre
        )
    );

  const restantes =
    actividadesZona.filter(
      (actividad) =>
        !favoritosActividades.includes(
          actividad.nombre
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

    actividades.forEach(
      (actividad) => {
        inicial[
          actividad.nombre
        ] =
          actividad.fecha;
      }
    );

    return inicial;
  });

  const [
    personas,
    setPersonas,
  ] = useState<{
    [key: string]: number;
  }>(() => {
    const inicial: {
      [key: string]: number;
    } = {};

    actividades.forEach(
      (actividad) => {
        inicial[
          actividad.nombre
        ] =
          actividad.personas;
      }
    );

    return inicial;
  });

  const estaAgregada = (
    nombre: string
  ) => {
    return actividades.some(
      (actividad) =>
        actividad.nombre ===
        nombre
    );
  };

  const guardarActividad = (
    opcion:
      (typeof ACTIVIDADES)[number]
  ) => {
    const fecha =
      fechasElegidas[
        opcion.nombre
      ];

    if (!fecha) {
      return;
    }

    const cantidad =
      personas[
        opcion.nombre
      ] ||
      hospedaje?.huespedes ||
      1;

    const nuevaActividad: Actividad =
      {
        nombre:
          opcion.nombre,

        ubicacion:
          opcion.ubicacion,

        duracion:
          opcion.duracion,

        tipo:
          opcion.tipo,

        precio:
          opcion.precio,

        personas:
          cantidad,

        fecha,
      };

    agregarActividad(
      nuevaActividad
    );
  };

  /* =========================================
     TARJETA ACTIVIDAD
  ========================================= */

  const renderActividad = (
    actividad:
      (typeof ACTIVIDADES)[number]
  ) => {
    const favorito =
      favoritosActividades.includes(
        actividad.nombre
      );

    const agregada =
      estaAgregada(
        actividad.nombre
      );

    const fecha =
      fechasElegidas[
        actividad.nombre
      ];

    const cantidad =
      personas[
        actividad.nombre
      ] ||
      hospedaje?.huespedes ||
      1;

    return (
      <View
        key={actividad.nombre}
        style={styles.card}
      >
        {/* PARTE PRINCIPAL */}

        <View
          style={
            styles.actividadPrincipal
          }
        >
          {/* IMAGEN IZQUIERDA */}

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
              style={
                styles.imagenActividad
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
                {actividad.emoji}
              </Text>

              <Text
                style={
                  styles.placeholderTexto
                }
              >
                Actividad
              </Text>
            </View>
          )}

          {/* INFORMACIÓN */}

          <View
            style={
              styles.infoActividad
            }
          >
            <View
              style={styles.tipoFila}
            >
              <Text
                style={styles.tipo}
              >
                {actividad.tipo}
              </Text>

              <TouchableOpacity
                style={styles.corazon}
                onPress={() =>
                  toggleFavoritoActividad(
                    actividad.nombre
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
              {actividad.nombre}
            </Text>

            <Text
              style={
                styles.descripcionActividad
              }
            >
              {
                actividad.descripcion
              }
            </Text>

            <View
              style={styles.datosFila}
            >
              <View
                style={styles.datoChip}
              >
                <Text
                  style={
                    styles.datoTexto
                  }
                >
                  ⏱️{' '}
                  {
                    actividad.duracion
                  }
                </Text>
              </View>

              <View
                style={styles.datoChip}
              >
                <Text
                  style={
                    styles.datoTexto
                  }
                >
                  💲$
                  {actividad.precio.toLocaleString(
                    'es-MX'
                  )}
                </Text>
              </View>
            </View>

            <Text
              style={styles.notaPrecio}
            >
              Precio por persona
            </Text>
          </View>
        </View>

        {/* SEPARADOR */}

        <View
          style={styles.separador}
        />

        {/* FECHA */}

        <Text style={styles.label}>
          📅 Selecciona el día
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

                    [actividad.nombre]:
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

        {/* PERSONAS */}

        <View
          style={styles.personasFila}
        >
          <View>
            <Text
              style={styles.labelPersonas}
            >
              👥 Personas
            </Text>

            <Text
              style={styles.total}
            >
              Total: $
              {(
                actividad.precio *
                cantidad
              ).toLocaleString(
                'es-MX'
              )}
            </Text>
          </View>

          <View
            style={styles.contador}
          >
            <TouchableOpacity
              style={
                styles.contadorBoton
              }
              onPress={() =>
                setPersonas(
                  (actual) => ({
                    ...actual,

                    [actividad.nombre]:
                      Math.max(
                        1,
                        cantidad - 1
                      ),
                  })
                )
              }
            >
              <Text
                style={styles.simbolo}
              >
                −
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.contadorNumero
              }
            >
              {cantidad}
            </Text>

            <TouchableOpacity
              style={
                styles.contadorBoton
              }
              onPress={() =>
                setPersonas(
                  (actual) => ({
                    ...actual,

                    [actividad.nombre]:
                      Math.min(
                        10,
                        cantidad + 1
                      ),
                  })
                )
              }
            >
              <Text
                style={styles.simbolo}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÓN */}

        <TouchableOpacity
          disabled={!fecha}
          style={[
            styles.boton,

            agregada &&
              styles.botonAgregado,

            !fecha &&
              styles.botonDeshabilitado,
          ]}
          onPress={() =>
            guardarActividad(
              actividad
            )
          }
        >
          <Text
            style={styles.botonTexto}
          >
            {!fecha
              ? 'Selecciona un día'
              : agregada
              ? '✓ Actualizar actividad'
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
              Actividades
            </Text>
          </View>
        </View>

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
              Después aparecerán las
              actividades correspondientes
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
            <View
              style={
                styles.presentacion
              }
            >
              <Text
                style={styles.etiqueta}
              >
                ACTIVIDADES EN
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
                Explora las actividades
                disponibles cerca de tu
                hospedaje.
              </Text>
            </View>

            {/* FAVORITAS */}

            {favoritas.length > 0 && (
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

                {favoritas.map(
                  renderActividad
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
                {favoritas.length > 0
                  ? 'Más actividades'
                  : 'Actividades disponibles'}
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
              renderActividad
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

    /* IMPORTANTE:
       Esto evita que la imagen
       se estire hacia abajo. */

    actividadPrincipal: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    imagenActividad: {
      width: 175,
      height: 175,

      minWidth: 175,
      maxWidth: 175,

      minHeight: 175,
      maxHeight: 175,

      borderRadius: 20,

      backgroundColor: '#DDEEEB',
    },

    imagenPlaceholder: {
      width: 175,
      height: 175,

      minWidth: 175,
      maxWidth: 175,

      minHeight: 175,
      maxHeight: 175,

      borderRadius: 20,

      backgroundColor: '#DDEEEB',

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

    infoActividad: {
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

    descripcionActividad: {
      marginTop: 10,

      fontSize: 11,

      lineHeight: 17,

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

    datosFila: {
      marginTop: 13,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    datoChip: {
      marginRight: 7,
      marginBottom: 5,

      paddingHorizontal: 10,
      paddingVertical: 7,

      borderRadius: 15,

      backgroundColor: '#EAF5F3',
    },

    datoTexto: {
      fontSize: 9,

      fontWeight: '800',

      color: '#087F8C',
    },

    notaPrecio: {
      marginTop: 4,

      fontSize: 8,

      color: '#899699',
    },

    separador: {
      height: 1,

      marginTop: 18,

      backgroundColor: '#E7EEEE',
    },

    label: {
      marginTop: 17,

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

    personasFila: {
      marginTop: 17,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    labelPersonas: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    total: {
      marginTop: 5,

      fontSize: 11,

      fontWeight: '900',

      color: '#087F8C',
    },

    contador: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    contadorBoton: {
      width: 36,
      height: 36,

      borderRadius: 18,

      backgroundColor: '#E2F2F1',

      justifyContent: 'center',
      alignItems: 'center',
    },

    simbolo: {
      fontSize: 18,

      fontWeight: '900',

      color: '#087F8C',
    },

    contadorNumero: {
      marginHorizontal: 14,

      fontSize: 15,

      fontWeight: '900',

      color: '#203438',
    },

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
