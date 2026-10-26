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

/* =========================================
   DATOS DE ACTIVIDADES Y RESTAURANTES
========================================= */


/* =========================================
   FUNCIONES DE FECHA
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

function fechaBonita(
  fecha: string
) {
  const convertida =
    convertirFecha(fecha);

  if (!convertida) {
    return fecha;
  }

  return convertida.toLocaleDateString(
    'es-MX',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
  );
}

function calcularNoches(
  llegada?: string,
  salida?: string
) {
  const inicio =
    convertirFecha(llegada);

  const fin =
    convertirFecha(salida);

  if (!inicio || !fin) {
    return 0;
  }

  const diferencia =
    fin.getTime() -
    inicio.getTime();

  return Math.max(
    0,
    Math.round(
      diferencia /
        86400000
    )
  );
}

function obtenerDiasViaje(
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

export default function MiViajeScreen() {
  const { hospedajes: HOSPEDAJES, zonas: ZONAS } = useCatalogos();
  const ACTIVIDADES_CATALOGO = ZONAS.flatMap((zona) => zona.actividades.map((actividad) => ({ ...actividad, ubicacion: zona.nombre })));
  const RESTAURANTES_CATALOGO = ZONAS.flatMap((zona) => zona.restaurantes.map((restaurante) => ({ ...restaurante, ubicacion: zona.nombre })));
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  const {
    hospedaje,
    actividades,
    restaurantes,
    lugares,

    eliminarHospedaje,
    eliminarActividad,
    eliminarRestaurante,
    eliminarLugar,
  } = useViaje();

  /* =========================================
     DETALLE DEL HOTEL
  ========================================= */

  const detalleHospedaje =
    HOSPEDAJES.find(
      (item) =>
        item.id ===
        hospedaje?.id
    ) ||
    HOSPEDAJES.find(
      (item) =>
        item.nombre ===
        hospedaje?.nombre
    );

  /* =========================================
     TOTALES
  ========================================= */

  const noches =
    calcularNoches(
      hospedaje?.fechaLlegada,
      hospedaje?.fechaSalida
    );

  const precioHospedaje =
    Number(
      hospedaje?.precio || 0
    );

  const totalHospedaje =
    precioHospedaje *
    noches;

  const totalActividades =
    actividades.reduce(
      (
        acumulado,
        actividad
      ) =>
        acumulado +
        actividad.precio *
          actividad.personas,
      0
    );

  const totalViaje =
    totalHospedaje +
    totalActividades;

  /* =========================================
     DÍAS DEL ITINERARIO
  ========================================= */

  const diasViaje =
    obtenerDiasViaje(
      hospedaje?.fechaLlegada,
      hospedaje?.fechaSalida
    );

  /* =========================================
     OBTENER DATOS COMPLETOS
  ========================================= */

  const obtenerActividad =
    (nombre: string) =>
      ACTIVIDADES_CATALOGO.find(
        (actividad) =>
          actividad.nombre ===
          nombre
      );

  const obtenerRestaurante =
    (nombre: string) =>
      RESTAURANTES_CATALOGO.find(
        (restaurante) =>
          restaurante.nombre ===
          nombre
      );

  /* =========================================
     SIN VIAJE
  ========================================= */

  const viajeVacio =
    !hospedaje &&
    actividades.length === 0 &&
    restaurantes.length === 0 &&
    lugares.length === 0;

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
              Organiza tu experiencia
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
            TU EXPERIENCIA
          </Text>

          <Text style={styles.titulo}>
            Mi viaje
          </Text>

          <Text
            style={
              styles.descripcionPagina
            }
          >
            Consulta tu hospedaje,
            actividades, restaurantes y
            el itinerario que has
            preparado para tu visita.
          </Text>
        </View>

        {/* =====================================
            VIAJE VACÍO
        ===================================== */}

        {viajeVacio && (
          <View
            style={
              styles.vacioCard
            }
          >
            <Text
              style={
                styles.vacioEmoji
              }
            >
              🧳
            </Text>

            <Text
              style={
                styles.vacioTitulo
              }
            >
              Tu viaje todavía está vacío
            </Text>

            <Text
              style={
                styles.vacioTexto
              }
            >
              Comienza explorando Hidalgo
              y reserva un hospedaje para
              recibir actividades y
              restaurantes de esa zona.
            </Text>

            <TouchableOpacity
              style={styles.boton}
              onPress={() =>
                router.push(
                  '/explorar' as any
                )
              }
            >
              <Text
                style={
                  styles.botonTexto
                }
              >
                Explorar Hidalgo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =====================================
            HOSPEDAJE
        ===================================== */}

        {hospedaje && (
          <>
            {hospedaje.metodoPago && (
              <View style={styles.card}>
                <Text style={styles.seccionTitulo}>Método de pago</Text>
                <Text style={styles.seccionTexto}>{hospedaje.metodoPago}</Text>
                <Text style={styles.seccionTexto}>Reserva guardada · Pago pendiente, sin cobro real</Text>
              </View>
            )}
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
                🏨 Tu hospedaje
              </Text>

              <Text
                style={
                  styles.seccionTexto
                }
              >
                Base principal de tu viaje
              </Text>
            </View>

            <View
              style={styles.card}
            >
              <View
                style={[
                  styles.hotelPrincipal,

                  esMovil &&
                    styles.hotelPrincipalMovil,
                ]}
              >
                {/* IMAGEN */}

                {detalleHospedaje && (
                  <Image
                    source={{
                      uri:
                        detalleHospedaje
                          .imagenes[0],
                    }}
                    style={[
                      styles.hotelImagen,

                      esMovil &&
                        styles.hotelImagenMovil,
                    ]}
                    resizeMode="cover"
                  />
                )}

                {/* INFO */}

                <View
                  style={[
                    styles.hotelInfo,

                    esMovil &&
                      styles.hotelInfoMovil,
                  ]}
                >
                  <Text
                    style={
                      styles.tipo
                    }
                  >
                    {detalleHospedaje?.tipo ||
                      'HOSPEDAJE'}
                  </Text>

                  <Text
                    style={
                      styles.hotelNombre
                    }
                  >
                    {hospedaje.nombre}
                  </Text>

                  <Text
                    style={
                      styles.ubicacion
                    }
                  >
                    📍{' '}
                    {hospedaje.ubicacion}
                  </Text>

                  {hospedaje.calificacion && (
                    <Text
                      style={
                        styles.calificacion
                      }
                    >
                      ⭐{' '}
                      {
                        hospedaje.calificacion
                      }
                    </Text>
                  )}

                  {detalleHospedaje && (
                    <View
                      style={
                        styles.hotelChips
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
                          👥{' '}
                          {
                            detalleHospedaje.capacidad
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
                          🛏️{' '}
                          {
                            detalleHospedaje.camas
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
                          🚿{' '}
                          {
                            detalleHospedaje.banos
                          }
                        </Text>
                      </View>
                    </View>
                  )}

                  <View
                    style={
                      styles.fechasHotel
                    }
                  >
                    <View
                      style={
                        styles.fechaHotel
                      }
                    >
                      <Text
                        style={
                          styles.fechaEtiqueta
                        }
                      >
                        LLEGADA
                      </Text>

                      <Text
                        style={
                          styles.fechaValor
                        }
                      >
                        {
                          hospedaje.fechaLlegada
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.fechaHotel
                      }
                    >
                      <Text
                        style={
                          styles.fechaEtiqueta
                        }
                      >
                        SALIDA
                      </Text>

                      <Text
                        style={
                          styles.fechaValor
                        }
                      >
                        {
                          hospedaje.fechaSalida
                        }
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.huespedes
                    }
                  >
                    👥{' '}
                    {hospedaje.huespedes ||
                      1}{' '}
                    huésped
                    {(hospedaje.huespedes ||
                      1) > 1
                      ? 'es'
                      : ''}
                  </Text>
                </View>
              </View>

              {/* PRECIO Y BOTONES */}

              <View
                style={
                  styles.hotelFooter
                }
              >
                <View>
                  <Text
                    style={
                      styles.precioEtiqueta
                    }
                  >
                    {noches}{' '}
                    {noches === 1
                      ? 'noche'
                      : 'noches'}
                  </Text>

                  <Text
                    style={
                      styles.precioGrande
                    }
                  >
                    $
                    {totalHospedaje.toLocaleString(
                      'es-MX'
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.acciones
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.botonSecundario
                    }
                    onPress={() =>
                      router.push({
                        pathname:
                          '/detalle-hospedaje',

                        params: {
                          id:
                            hospedaje.id,

                          modo:
                            'editar',
                        },
                      } as any)
                    }
                  >
                    <Text
                      style={
                        styles.botonSecundarioTexto
                      }
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.botonEliminar
                    }
                    onPress={
                      eliminarHospedaje
                    }
                  >
                    <Text
                      style={
                        styles.botonEliminarTexto
                      }
                    >
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        {/* =====================================
            ACTIVIDADES
        ===================================== */}

        {actividades.length > 0 && (
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
                🎡 Actividades
              </Text>

              <Text
                style={
                  styles.seccionTexto
                }
              >
                {actividades.length}{' '}
                actividad
                {actividades.length > 1
                  ? 'es'
                  : ''}{' '}
                agregada
                {actividades.length > 1
                  ? 's'
                  : ''}
              </Text>
            </View>

            {actividades.map(
              (actividad) => {
                const detalle =
                  obtenerActividad(
                    actividad.nombre
                  );

                return (
                  <View
                    key={
                      actividad.nombre
                    }
                    style={styles.card}
                  >
                    <View
                      style={[
                        styles.itemPrincipal,

                        esMovil &&
                          styles.itemPrincipalMovil,
                      ]}
                    >
                      {detalle?.imagen ? (
                        <Image
                          source={
                            typeof detalle.imagen ===
                            'string'
                              ? {
                                  uri:
                                    detalle.imagen,
                                }
                              : detalle.imagen
                          }
                          style={[
                            styles.itemImagen,

                            esMovil &&
                              styles.itemImagenMovil,
                          ]}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.itemPlaceholder,

                            esMovil &&
                              styles.itemImagenMovil,
                          ]}
                        >
                          <Text
                            style={
                              styles.placeholderEmoji
                            }
                          >
                            {detalle?.emoji ||
                              '🎡'}
                          </Text>
                        </View>
                      )}

                      <View
                        style={[
                          styles.itemInfo,

                          esMovil &&
                            styles.itemInfoMovil,
                        ]}
                      >
                        <Text
                          style={
                            styles.tipo
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

                        {detalle && (
                          <Text
                            style={
                              styles.itemDescripcion
                            }
                          >
                            {
                              detalle.descripcion
                            }
                          </Text>
                        )}

                        <View
                          style={
                            styles.itemChips
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
                              📅{' '}
                              {
                                actividad.fecha
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
                              👥{' '}
                              {
                                actividad.personas
                              }
                            </Text>
                          </View>
                        </View>

                        <View
                          style={
                            styles.itemFooter
                          }
                        >
                          <Text
                            style={
                              styles.itemPrecio
                            }
                          >
                            $
                            {(
                              actividad.precio *
                              actividad.personas
                            ).toLocaleString(
                              'es-MX'
                            )}
                          </Text>

                          <TouchableOpacity
                            onPress={() =>
                              eliminarActividad(
                                actividad.nombre
                              )
                            }
                          >
                            <Text
                              style={
                                styles.eliminarTexto
                              }
                            >
                              Eliminar
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            )}
          </>
        )}

        {/* =====================================
            RESTAURANTES
        ===================================== */}

        {restaurantes.length >
          0 && (
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
                🍽️ Restaurantes
              </Text>

              <Text
                style={
                  styles.seccionTexto
                }
              >
                {restaurantes.length}{' '}
                opción
                {restaurantes.length > 1
                  ? 'es'
                  : ''}{' '}
                agregada
                {restaurantes.length > 1
                  ? 's'
                  : ''}
              </Text>
            </View>

            {restaurantes.map(
              (restaurante) => {
                const detalle =
                  obtenerRestaurante(
                    restaurante.nombre
                  );

                return (
                  <View
                    key={
                      restaurante.nombre
                    }
                    style={styles.card}
                  >
                    <View
                      style={[
                        styles.itemPrincipal,

                        esMovil &&
                          styles.itemPrincipalMovil,
                      ]}
                    >
                      {detalle?.imagen ? (
                        <Image
                          source={
                            typeof detalle.imagen ===
                            'string'
                              ? {
                                  uri:
                                    detalle.imagen,
                                }
                              : detalle.imagen
                          }
                          style={[
                            styles.itemImagen,

                            esMovil &&
                              styles.itemImagenMovil,
                          ]}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.restaurantePlaceholder,

                            esMovil &&
                              styles.itemImagenMovil,
                          ]}
                        >
                          <Text
                            style={
                              styles.placeholderEmoji
                            }
                          >
                            {detalle?.emoji ||
                              '🍽️'}
                          </Text>
                        </View>
                      )}

                      <View
                        style={[
                          styles.itemInfo,

                          esMovil &&
                            styles.itemInfoMovil,
                        ]}
                      >
                        <Text
                          style={
                            styles.tipo
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

                        {restaurante.calificacion && (
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
                        )}

                        {detalle && (
                          <>
                            <Text
                              style={
                                styles.itemDescripcion
                              }
                            >
                              {
                                detalle.descripcion
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
                                  detalle.menu
                                }
                              </Text>
                            </View>
                          </>
                        )}

                        <View
                          style={
                            styles.itemFooter
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
                              📅{' '}
                              {
                                restaurante.fecha
                              }
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() =>
                              eliminarRestaurante(
                                restaurante.nombre
                              )
                            }
                          >
                            <Text
                              style={
                                styles.eliminarTexto
                              }
                            >
                              Eliminar
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            )}
          </>
        )}

        {/* =====================================
            LUGARES GUARDADOS - SI EXISTEN
        ===================================== */}

        {lugares.length > 0 && (
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
                🏛️ Lugares
              </Text>
            </View>

            <View
              style={styles.card}
            >
              {lugares.map(
                (
                  lugar,
                  index
                ) => (
                  <View
                    key={
                      lugar.nombre
                    }
                    style={[
                      styles.lugarFila,

                      index !==
                        lugares.length -
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

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={
                          styles.lugarNombre
                        }
                      >
                        {lugar.nombre}
                      </Text>

                      <Text
                        style={
                          styles.lugarDetalle
                        }
                      >
                        {lugar.ubicacion}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        eliminarLugar(
                          lugar.nombre
                        )
                      }
                    >
                      <Text
                        style={
                          styles.eliminarTexto
                        }
                      >
                        Eliminar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          </>
        )}

        {/* =====================================
            RESUMEN DE COSTOS
        ===================================== */}

        {hospedaje && (
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
                💳 Resumen
              </Text>

              <Text
                style={
                  styles.seccionTexto
                }
              >
                Costos aproximados de tu
                viaje
              </Text>
            </View>

            <View
              style={styles.card}
            >
              <View
                style={
                  styles.resumenFila
                }
              >
                <Text
                  style={
                    styles.resumenLabel
                  }
                >
                  Hospedaje
                </Text>

                <Text
                  style={
                    styles.resumenValor
                  }
                >
                  $
                  {totalHospedaje.toLocaleString(
                    'es-MX'
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.resumenFila
                }
              >
                <Text
                  style={
                    styles.resumenLabel
                  }
                >
                  Actividades
                </Text>

                <Text
                  style={
                    styles.resumenValor
                  }
                >
                  $
                  {totalActividades.toLocaleString(
                    'es-MX'
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.resumenFila
                }
              >
                <Text
                  style={
                    styles.resumenLabel
                  }
                >
                  Restaurantes
                </Text>

                <Text
                  style={
                    styles.resumenNota
                  }
                >
                  Consumo no incluido
                </Text>
              </View>

              <View
                style={
                  styles.totalSeparador
                }
              />

              <View
                style={
                  styles.resumenFila
                }
              >
                <Text
                  style={
                    styles.totalLabel
                  }
                >
                  Total estimado
                </Text>

                <Text
                  style={
                    styles.totalValor
                  }
                >
                  $
                  {totalViaje.toLocaleString(
                    'es-MX'
                  )}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* =====================================
            ITINERARIO
        ===================================== */}

        {hospedaje &&
          diasViaje.length > 0 && (
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
                  🗓️ Itinerario
                </Text>

                <Text
                  style={
                    styles.seccionTexto
                  }
                >
                  Tu viaje organizado por
                  día
                </Text>
              </View>

              {diasViaje.map(
                (
                  dia,
                  index
                ) => {
                  const actividadesDia =
                    actividades.filter(
                      (actividad) =>
                        actividad.fecha ===
                        dia
                    );

                  const restaurantesDia =
                    restaurantes.filter(
                      (restaurante) =>
                        restaurante.fecha ===
                        dia
                    );

                  return (
                    <View
                      key={dia}
                      style={
                        styles.itinerarioCard
                      }
                    >
                      <View
                        style={
                          styles.itinerarioHeader
                        }
                      >
                        <View
                          style={
                            styles.diaNumero
                          }
                        >
                          <Text
                            style={
                              styles.diaNumeroTexto
                            }
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={
                              styles.diaEtiqueta
                            }
                          >
                            DÍA{' '}
                            {index + 1}
                          </Text>

                          <Text
                            style={
                              styles.diaFecha
                            }
                          >
                            {fechaBonita(
                              dia
                            )}
                          </Text>
                        </View>
                      </View>

                      {actividadesDia.length ===
                        0 &&
                      restaurantesDia.length ===
                        0 ? (
                        <View
                          style={
                            styles.sinPlanes
                          }
                        >
                          <Text
                            style={
                              styles.sinPlanesTexto
                            }
                          >
                            Día libre. Puedes
                            agregar actividades
                            o restaurantes.
                          </Text>
                        </View>
                      ) : (
                        <>
                          {actividadesDia.map(
                            (
                              actividad
                            ) => (
                              <View
                                key={
                                  actividad.nombre
                                }
                                style={
                                  styles.planFila
                                }
                              >
                                <View
                                  style={
                                    styles.planIcono
                                  }
                                >
                                  <Text>
                                    🎡
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                  }}
                                >
                                  <Text
                                    style={
                                      styles.planTipo
                                    }
                                  >
                                    ACTIVIDAD
                                  </Text>

                                  <Text
                                    style={
                                      styles.planNombre
                                    }
                                  >
                                    {
                                      actividad.nombre
                                    }
                                  </Text>

                                  <Text
                                    style={
                                      styles.planDetalle
                                    }
                                  >
                                    ⏱️{' '}
                                    {
                                      actividad.duracion
                                    }{' '}
                                    • 👥{' '}
                                    {
                                      actividad.personas
                                    }
                                  </Text>
                                </View>
                              </View>
                            )
                          )}

                          {restaurantesDia.map(
                            (
                              restaurante
                            ) => (
                              <View
                                key={
                                  restaurante.nombre
                                }
                                style={
                                  styles.planFila
                                }
                              >
                                <View
                                  style={
                                    styles.planIcono
                                  }
                                >
                                  <Text>
                                    🍽️
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                  }}
                                >
                                  <Text
                                    style={
                                      styles.planTipo
                                    }
                                  >
                                    RESTAURANTE
                                  </Text>

                                  <Text
                                    style={
                                      styles.planNombre
                                    }
                                  >
                                    {
                                      restaurante.nombre
                                    }
                                  </Text>

                                  <Text
                                    style={
                                      styles.planDetalle
                                    }
                                  >
                                    {
                                      restaurante.tipo
                                    }
                                  </Text>
                                </View>
                              </View>
                            )
                          )}
                        </>
                      )}
                    </View>
                  );
                }
              )}
            </>
          )}

        {/* =====================================
            BOTONES PARA SEGUIR AGREGANDO
        ===================================== */}

        {hospedaje && (
          <View
            style={styles.accionesViaje}
          >
            <Text
              style={
                styles.accionesTitulo
              }
            >
              Sigue planeando
            </Text>

            <View
              style={
                styles.botonesPlaneacion
              }
            >
              <TouchableOpacity
                style={
                  styles.botonPlaneacion
                }
                onPress={() =>
                  router.push(
                    '/actividades' as any
                  )
                }
              >
                <Text
                  style={
                    styles.botonPlaneacionEmoji
                  }
                >
                  🎡
                </Text>

                <Text
                  style={
                    styles.botonPlaneacionTexto
                  }
                >
                  Actividades
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.botonPlaneacion
                }
                onPress={() =>
                  router.push(
                    '/restaurantes' as any
                  )
                }
              >
                <Text
                  style={
                    styles.botonPlaneacionEmoji
                  }
                >
                  🍽️
                </Text>

                <Text
                  style={
                    styles.botonPlaneacionTexto
                  }
                >
                  Restaurantes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* =====================================
          NAVEGACIÓN INFERIOR
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
        >
          <Text
            style={[
              styles.navEmoji,
              styles.navActivo,
            ]}
          >
            🧳
          </Text>

          <Text
            style={[
              styles.navTexto,
              styles.navTextoActivo,
            ]}
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
      paddingBottom: 125,
    },

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

    /* SECCIONES */

    seccionHeader: {
      width: '100%',
      maxWidth: 950,

      alignSelf: 'center',

      marginTop: 28,

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

      marginTop: 15,

      padding: 18,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    /* HOTEL */

    hotelPrincipal: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    hotelPrincipalMovil: {
      flexDirection: 'column',
    },

    hotelImagen: {
      width: 220,
      height: 220,

      minWidth: 220,
      maxWidth: 220,

      borderRadius: 20,

      backgroundColor:
        '#DDEEEB',
    },

    hotelImagenMovil: {
      width: '100%',
      maxWidth: '100%',
      minWidth: '100%',

      height: 210,
    },

    hotelInfo: {
      flex: 1,

      minWidth: 0,

      paddingLeft: 20,
    },

    hotelInfoMovil: {
      width: '100%',

      paddingLeft: 0,
      paddingTop: 17,
    },

    tipo: {
      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 0.5,

      textTransform:
        'uppercase',

      color: '#087F8C',
    },

    hotelNombre: {
      marginTop: 5,

      fontSize: 20,

      fontWeight: '900',

      color: '#203438',
    },

    ubicacion: {
      marginTop: 6,

      fontSize: 10,

      color: '#748589',
    },

    calificacion: {
      marginTop: 6,

      fontSize: 10,

      fontWeight: '800',

      color: '#53666A',
    },

    hotelChips: {
      marginTop: 12,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    chip: {
      marginRight: 7,
      marginBottom: 6,

      paddingHorizontal: 9,
      paddingVertical: 7,

      borderRadius: 14,

      backgroundColor:
        '#EAF5F3',
    },

    chipTexto: {
      fontSize: 8,

      fontWeight: '800',

      color: '#087F8C',
    },

    fechasHotel: {
      marginTop: 10,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    fechaHotel: {
      minWidth: 120,

      marginRight: 10,
      marginBottom: 8,

      padding: 10,

      borderRadius: 14,

      backgroundColor:
        '#F5F9F8',
    },

    fechaEtiqueta: {
      fontSize: 7,

      fontWeight: '900',

      color: '#087F8C',
    },

    fechaValor: {
      marginTop: 4,

      fontSize: 10,

      fontWeight: '800',

      color: '#203438',
    },

    huespedes: {
      marginTop: 4,

      fontSize: 9,

      fontWeight: '700',

      color: '#53666A',
    },

    hotelFooter: {
      marginTop: 18,

      paddingTop: 15,

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

    precioGrande: {
      marginTop: 3,

      fontSize: 21,

      fontWeight: '900',

      color: '#087F8C',
    },

    acciones: {
      flexDirection: 'row',
    },

    botonSecundario: {
      marginRight: 8,

      paddingHorizontal: 17,
      paddingVertical: 11,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',
    },

    botonSecundarioTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    botonEliminar: {
      paddingHorizontal: 17,
      paddingVertical: 11,

      borderRadius: 17,

      backgroundColor:
        '#FFF1F1',
    },

    botonEliminarTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#B54D4D',
    },

    /* ACTIVIDADES / RESTAURANTES */

    itemPrincipal: {
      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    itemPrincipalMovil: {
      flexDirection: 'column',
    },

    itemImagen: {
      width: 150,
      height: 150,

      minWidth: 150,
      maxWidth: 150,

      borderRadius: 18,

      backgroundColor:
        '#DDEEEB',
    },

    itemImagenMovil: {
      width: '100%',
      maxWidth: '100%',
      minWidth: '100%',

      height: 190,
    },

    itemPlaceholder: {
      width: 150,
      height: 150,

      minWidth: 150,
      maxWidth: 150,

      borderRadius: 18,

      backgroundColor:
        '#DDEEEB',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    restaurantePlaceholder: {
      width: 150,
      height: 150,

      minWidth: 150,
      maxWidth: 150,

      borderRadius: 18,

      backgroundColor:
        '#EEE8DD',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    placeholderEmoji: {
      fontSize: 42,
    },

    itemInfo: {
      flex: 1,

      minWidth: 0,

      paddingLeft: 18,
    },

    itemInfoMovil: {
      width: '100%',

      paddingLeft: 0,
      paddingTop: 15,
    },

    itemNombre: {
      marginTop: 5,

      fontSize: 17,

      fontWeight: '900',

      color: '#203438',
    },

    itemDescripcion: {
      marginTop: 8,

      fontSize: 10,

      lineHeight: 16,

      color: '#53666A',
    },

    itemChips: {
      marginTop: 10,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    itemFooter: {
      marginTop: 12,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    itemPrecio: {
      fontSize: 16,

      fontWeight: '900',

      color: '#087F8C',
    },

    eliminarTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#B54D4D',
    },

    /* MENÚ */

    menuCaja: {
      marginTop: 10,

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

    lugarFila: {
      paddingVertical: 13,

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

      marginRight: 11,

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

    lugarNombre: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    lugarDetalle: {
      marginTop: 3,

      fontSize: 9,

      color: '#899699',
    },

    /* RESUMEN */

    resumenFila: {
      paddingVertical: 9,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    resumenLabel: {
      fontSize: 11,

      color: '#53666A',
    },

    resumenValor: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    resumenNota: {
      fontSize: 9,

      color: '#899699',
    },

    totalSeparador: {
      height: 1,

      marginVertical: 9,

      backgroundColor:
        '#E7EEEE',
    },

    totalLabel: {
      fontSize: 14,

      fontWeight: '900',

      color: '#203438',
    },

    totalValor: {
      fontSize: 22,

      fontWeight: '900',

      color: '#087F8C',
    },

    /* ITINERARIO */

    itinerarioCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 15,

      padding: 18,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    itinerarioHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingBottom: 13,

      borderBottomWidth: 1,

      borderBottomColor:
        '#E7EEEE',
    },

    diaNumero: {
      width: 42,
      height: 42,

      marginRight: 12,

      borderRadius: 21,

      backgroundColor:
        '#087F8C',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    diaNumeroTexto: {
      fontSize: 14,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    diaEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      color: '#087F8C',
    },

    diaFecha: {
      marginTop: 3,

      fontSize: 13,

      fontWeight: '900',

      textTransform:
        'capitalize',

      color: '#203438',
    },

    planFila: {
      paddingVertical: 13,

      flexDirection: 'row',

      alignItems: 'center',

      borderBottomWidth: 1,

      borderBottomColor:
        '#EDF2F1',
    },

    planIcono: {
      width: 38,
      height: 38,

      marginRight: 11,

      borderRadius: 19,

      backgroundColor:
        '#F5F9F8',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    planTipo: {
      fontSize: 7,

      fontWeight: '900',

      color: '#087F8C',
    },

    planNombre: {
      marginTop: 3,

      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    planDetalle: {
      marginTop: 3,

      fontSize: 9,

      color: '#899699',
    },

    sinPlanes: {
      marginTop: 14,

      padding: 15,

      borderRadius: 17,

      backgroundColor:
        '#F5F9F8',
    },

    sinPlanesTexto: {
      fontSize: 10,

      textAlign: 'center',

      color: '#899699',
    },

    /* CONTINUAR */

    accionesViaje: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 28,
    },

    accionesTitulo: {
      fontSize: 18,

      fontWeight: '900',

      color: '#203438',
    },

    botonesPlaneacion: {
      marginTop: 13,

      flexDirection: 'row',

      gap: 10,
    },

    botonPlaneacion: {
      flex: 1,

      padding: 17,

      borderRadius: 20,

      backgroundColor:
        '#FFFFFF',

      alignItems: 'center',
    },

    botonPlaneacionEmoji: {
      fontSize: 25,
    },

    botonPlaneacionTexto: {
      marginTop: 6,

      fontSize: 10,

      fontWeight: '900',

      color: '#203438',
    },

    /* VACÍO */

    vacioCard: {
      width: '90%',
      maxWidth: 650,

      alignSelf: 'center',

      marginTop: 35,

      padding: 30,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',

      alignItems: 'center',
    },

    vacioEmoji: {
      fontSize: 53,
    },

    vacioTitulo: {
      marginTop: 13,

      fontSize: 19,

      fontWeight: '900',

      textAlign: 'center',

      color: '#203438',
    },

    vacioTexto: {
      marginTop: 8,

      maxWidth: 450,

      fontSize: 11,

      lineHeight: 18,

      textAlign: 'center',

      color: '#748589',
    },

    boton: {
      marginTop: 18,

      paddingHorizontal: 25,
      paddingVertical: 14,

      borderRadius: 20,

      backgroundColor:
        '#087F8C',

      alignItems: 'center',
    },

    botonTexto: {
      fontSize: 10,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    /* NAV */

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
