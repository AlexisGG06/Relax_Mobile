import {
  Image,
  Modal,
  Pressable,
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

import {
  useMemo,
  useState,
} from 'react';

import { useCatalogos } from '../context/CatalogosContext';

import {
  useViaje,
} from '../context/ViajeContext';
import { MetodosPago, estilosPago } from '../components/metodos-pago';
import { nombreMetodo, usePagos } from '../context/PagosContext';

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
  fecha?: Date | null
) {
  if (!fecha) {
    return 'Selecciona una fecha';
  }

  return fecha.toLocaleDateString(
    'es-MX',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
}

function mismaFecha(
  fecha1: Date,
  fecha2: Date
) {
  return (
    fecha1.getFullYear() ===
      fecha2.getFullYear() &&
    fecha1.getMonth() ===
      fecha2.getMonth() &&
    fecha1.getDate() ===
      fecha2.getDate()
  );
}

function calcularNoches(
  llegada?: Date | null,
  salida?: Date | null
) {
  if (
    !llegada ||
    !salida
  ) {
    return 0;
  }

  const inicio = Date.UTC(
    llegada.getFullYear(),
    llegada.getMonth(),
    llegada.getDate()
  );

  const fin = Date.UTC(
    salida.getFullYear(),
    salida.getMonth(),
    salida.getDate()
  );

  return Math.max(
    0,
    Math.round(
      (fin - inicio) /
        86400000
    )
  );
}

/* =========================================
   PANTALLA
========================================= */

export default function DetalleHospedajeScreen() {
  const { hospedajes: HOSPEDAJES } = useCatalogos();
  const [guardando, setGuardando] = useState(false);
  const [errorPago, setErrorPago] = useState('');
  const { metodos } = usePagos();
  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [metodoId, setMetodoId] = useState<string | null>(null);
  const metodoSeleccionado = metodos.find((metodo) => metodo.id === metodoId) ?? metodos[0];
  const router = useRouter();

  const {
    width,
  } = useWindowDimensions();

  const esMovil =
    width < 700;

  const params =
    useLocalSearchParams<{
      id?: string;
      modo?: string;
    }>();

  const {
    hospedaje,
    reservarHospedaje,
  } = useViaje();

  /* =========================================
     BUSCAR HOSPEDAJE
  ========================================= */

  const idHospedaje =
    params.id ||
    hospedaje?.id;

  const detalle =
    HOSPEDAJES.find(
      (item) =>
        item.id ===
        idHospedaje
    ) ||
    HOSPEDAJES.find(
      (item) =>
        item.nombre ===
        hospedaje?.nombre
    );

  const esEdicion =
    params.modo === 'editar';

  /* =========================================
     FECHAS INICIALES
  ========================================= */

  const llegadaInicial =
    detalle &&
    hospedaje?.id ===
      detalle.id
      ? convertirFecha(
          hospedaje.fechaLlegada
        )
      : null;

  const salidaInicial =
    detalle &&
    hospedaje?.id ===
      detalle.id
      ? convertirFecha(
          hospedaje.fechaSalida
        )
      : null;

  const [
    fechaLlegada,
    setFechaLlegada,
  ] =
    useState<Date | null>(
      llegadaInicial
    );

  const [
    fechaSalida,
    setFechaSalida,
  ] =
    useState<Date | null>(
      salidaInicial
    );

  const [
    huespedes,
    setHuespedes,
  ] = useState(
    detalle &&
      hospedaje?.id ===
        detalle.id &&
      hospedaje.huespedes
      ? hospedaje.huespedes
      : 1
  );

  /* =========================================
     MES DEL CALENDARIO
  ========================================= */

  const fechaBase =
    llegadaInicial ||
    new Date();

  const [
    mesVisible,
    setMesVisible,
  ] = useState(
    new Date(
      fechaBase.getFullYear(),
      fechaBase.getMonth(),
      1
    )
  );

  const hoy =
    new Date();

  hoy.setHours(
    0,
    0,
    0,
    0
  );

  /* =========================================
     CALENDARIO
  ========================================= */

  const diasCalendario =
    useMemo(() => {
      const anio =
        mesVisible.getFullYear();

      const mes =
        mesVisible.getMonth();

      const primerDia =
        new Date(
          anio,
          mes,
          1
        ).getDay();

      const ultimoDia =
        new Date(
          anio,
          mes + 1,
          0
        ).getDate();

      const dias:
        (
          | Date
          | null
        )[] = [];

      for (
        let i = 0;
        i < primerDia;
        i++
      ) {
        dias.push(null);
      }

      for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
      ) {
        dias.push(
          new Date(
            anio,
            mes,
            dia
          )
        );
      }

      while (
        dias.length % 7 !==
        0
      ) {
        dias.push(null);
      }

      return dias;
    }, [mesVisible]);

  const seleccionarFecha = (
    fecha: Date
  ) => {
    const seleccion =
      new Date(fecha);

    seleccion.setHours(
      0,
      0,
      0,
      0
    );

    if (
      seleccion < hoy
    ) {
      return;
    }

    /*
      Si todavía no hay llegada
      o ya tenemos ambas fechas,
      iniciamos una nueva selección.
    */

    if (
      !fechaLlegada ||
      fechaSalida
    ) {
      setFechaLlegada(
        seleccion
      );

      setFechaSalida(null);

      return;
    }

    /*
      Si selecciona el mismo día
      o una fecha anterior,
      esa nueva fecha se convierte
      en llegada.
    */

    if (
      seleccion <=
      fechaLlegada
    ) {
      setFechaLlegada(
        seleccion
      );

      setFechaSalida(null);

      return;
    }

    /*
      En cualquier otro caso
      seleccionamos la salida.
    */

    setFechaSalida(
      seleccion
    );
  };

  const esFechaSeleccionada = (
    fecha: Date
  ) => {
    return (
      (fechaLlegada &&
        mismaFecha(
          fecha,
          fechaLlegada
        )) ||
      (fechaSalida &&
        mismaFecha(
          fecha,
          fechaSalida
        ))
    );
  };

  const estaEnRango = (
    fecha: Date
  ) => {
    if (
      !fechaLlegada ||
      !fechaSalida
    ) {
      return false;
    }

    return (
      fecha >
        fechaLlegada &&
      fecha <
        fechaSalida
    );
  };

  /* =========================================
     CAMBIAR MES
  ========================================= */

  const mesAnterior = () => {
    const anterior =
      new Date(
        mesVisible.getFullYear(),
        mesVisible.getMonth() -
          1,
        1
      );

    const mesActual =
      new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        1
      );

    if (
      anterior <
      mesActual
    ) {
      return;
    }

    setMesVisible(
      anterior
    );
  };

  const mesSiguiente = () => {
    setMesVisible(
      new Date(
        mesVisible.getFullYear(),
        mesVisible.getMonth() +
          1,
        1
      )
    );
  };

  /* =========================================
     SI NO EXISTE
  ========================================= */

  if (!detalle) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={
            styles.errorCard
          }
        >
          <Text
            style={
              styles.errorEmoji
            }
          >
            🏨
          </Text>

          <Text
            style={
              styles.errorTitulo
            }
          >
            Hospedaje no encontrado
          </Text>

          <TouchableOpacity
            style={styles.boton}
            onPress={() =>
              router.replace(
                '/hospedajes' as any
              )
            }
          >
            <Text
              style={
                styles.botonTexto
              }
            >
              Volver a hospedajes
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =========================================
     TOTALES
  ========================================= */

  const noches =
    calcularNoches(
      fechaLlegada,
      fechaSalida
    );

  const total =
    noches *
    detalle.precio;

  const puedeReservar =
    fechaLlegada &&
    fechaSalida &&
    noches > 0;

  /* =========================================
     GUARDAR
  ========================================= */

  const confirmarReserva =
    async () => {
      if (!metodoSeleccionado) return;
      if (
        !fechaLlegada ||
        !fechaSalida ||
        noches <= 0
      ) {
        return;
      }

      setGuardando(true);
      setErrorPago('');
      try {
      await reservarHospedaje({
        metodoPagoId: metodoSeleccionado.id,
        metodoPago: nombreMetodo(metodoSeleccionado),
        id:
          detalle.id,

        nombre:
          detalle.nombre,

        ubicacion:
          detalle.ubicacion,

        precio:
          detalle.precio.toString(),

        calificacion:
          detalle.calificacion.toString(),

        fechaLlegada:
          formatearFecha(
            fechaLlegada
          ),

        fechaSalida:
          formatearFecha(
            fechaSalida
          ),

        huespedes,
      });

      router.replace(
        '/mi-viaje' as any
      );
      setPagoAbierto(false);
      } catch (e) { setErrorPago(e instanceof Error ? e.message : 'No se pudo guardar la reserva.'); }
      finally { setGuardando(false); }
    };

  /* =========================================
     VISTA
  ========================================= */

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

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.regresar
            }
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

          <View>
            <Text
              style={styles.logo}
            >
              RELAX
            </Text>

            <Text
              style={
                styles.subtitulo
              }
            >
              Detalle del hospedaje
            </Text>
          </View>
        </View>

        {/* =====================================
            PRESENTACIÓN
        ===================================== */}

        <View
          style={
            styles.presentacion
          }
        >
          <Text
            style={
              styles.etiqueta
            }
          >
            {detalle.tipo.toUpperCase()}
          </Text>

          <Text
            style={styles.titulo}
          >
            {detalle.nombre}
          </Text>

          <View
            style={
              styles.ubicacionFila
            }
          >
            <Text
              style={
                styles.ubicacion
              }
            >
              📍{' '}
              {detalle.ubicacion}
            </Text>

            <Text
              style={
                styles.calificacion
              }
            >
              ⭐{' '}
              {detalle.calificacion}
            </Text>
          </View>
        </View>

        {/* =====================================
            GALERÍA
        ===================================== */}

        <View
          style={
            styles.galeriaContenedor
          }
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.galeria
            }
          >
            {detalle.imagenes.map(
              (
                imagen,
                index
              ) => (
                <Image
                  key={`${detalle.id}-${index}`}
                  source={{
                    uri: imagen,
                  }}
                  style={[
                    styles.imagenGaleria,

                    esMovil &&
                      styles.imagenGaleriaMovil,
                  ]}
                  resizeMode="cover"
                />
              )
            )}
          </ScrollView>
        </View>

        {/* =====================================
            DESCRIPCIÓN + DATOS
        ===================================== */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.cardTitulo
            }
          >
            Sobre tu estancia
          </Text>

          <Text
            style={
              styles.descripcion
            }
          >
            {detalle.descripcion}
          </Text>

          <View
            style={
              styles.habitacionCaja
            }
          >
            <Text
              style={
                styles.habitacionEtiqueta
              }
            >
              TIPO DE HABITACIÓN
            </Text>

            <Text
              style={
                styles.habitacionNombre
              }
            >
              🛏️{' '}
              {detalle.habitacion}
            </Text>
          </View>

          <View
            style={
              styles.datosGrid
            }
          >
            <View
              style={
                styles.datoCard
              }
            >
              <Text
                style={
                  styles.datoEmoji
                }
              >
                👥
              </Text>

              <Text
                style={
                  styles.datoNumero
                }
              >
                {detalle.capacidad}
              </Text>

              <Text
                style={
                  styles.datoLabel
                }
              >
                Capacidad
              </Text>
            </View>

            <View
              style={
                styles.datoCard
              }
            >
              <Text
                style={
                  styles.datoEmoji
                }
              >
                🛏️
              </Text>

              <Text
                style={
                  styles.datoNumero
                }
              >
                {detalle.camas}
              </Text>

              <Text
                style={
                  styles.datoLabel
                }
              >
                Camas
              </Text>
            </View>

            <View
              style={
                styles.datoCard
              }
            >
              <Text
                style={
                  styles.datoEmoji
                }
              >
                🚿
              </Text>

              <Text
                style={
                  styles.datoNumero
                }
              >
                {detalle.banos}
              </Text>

              <Text
                style={
                  styles.datoLabel
                }
              >
                Baños
              </Text>
            </View>
          </View>
        </View>

        {/* =====================================
            SERVICIOS
        ===================================== */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.cardTitulo
            }
          >
            Servicios incluidos
          </Text>

          <Text
            style={
              styles.cardSubtitulo
            }
          >
            Todo lo que encontrarás
            durante tu estancia.
          </Text>

          <View
            style={
              styles.servicios
            }
          >
            {detalle.servicios.map(
              (servicio) => (
                <View
                  key={servicio}
                  style={
                    styles.servicioChip
                  }
                >
                  <Text
                    style={
                      styles.servicioTexto
                    }
                  >
                    ✓ {servicio}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* =====================================
            HORARIOS
        ===================================== */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.cardTitulo
            }
          >
            Horarios
          </Text>

          <View
            style={[
              styles.horariosFila,

              esMovil &&
                styles.horariosFilaMovil,
            ]}
          >
            <View
              style={
                styles.horarioCard
              }
            >
              <Text
                style={
                  styles.horarioEtiqueta
                }
              >
                CHECK-IN
              </Text>

              <Text
                style={
                  styles.horarioHora
                }
              >
                🕒{' '}
                {detalle.checkIn}
              </Text>
            </View>

            <View
              style={[
                styles.horarioCard,

                !esMovil &&
                  styles.horarioCardSeparado,
              ]}
            >
              <Text
                style={
                  styles.horarioEtiqueta
                }
              >
                CHECK-OUT
              </Text>

              <Text
                style={
                  styles.horarioHora
                }
              >
                🕒{' '}
                {detalle.checkOut}
              </Text>
            </View>
          </View>
        </View>

        {/* =====================================
            POLÍTICAS
        ===================================== */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.cardTitulo
            }
          >
            Políticas del hospedaje
          </Text>

          {detalle.politicas.map(
            (
              politica,
              index
            ) => (
              <View
                key={politica}
                style={[
                  styles.politicaFila,

                  index !==
                    detalle.politicas
                      .length -
                      1 &&
                    styles.politicaSeparador,
                ]}
              >
                <View
                  style={
                    styles.politicaNumero
                  }
                >
                  <Text
                    style={
                      styles.politicaNumeroTexto
                    }
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={
                    styles.politicaTexto
                  }
                >
                  {politica}
                </Text>
              </View>
            )
          )}
        </View>

        {/* =====================================
            RESERVACIÓN
        ===================================== */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.cardEtiqueta
            }
          >
            TU RESERVACIÓN
          </Text>

          <Text
            style={
              styles.cardTituloGrande
            }
          >
            Selecciona tus fechas
          </Text>

          <Text
            style={
              styles.cardSubtitulo
            }
          >
            Primero elige la fecha
            de llegada y después la
            fecha de salida.
          </Text>

          {/* FECHAS SELECCIONADAS */}

          <View
            style={[
              styles.fechasResumen,

              esMovil &&
                styles.fechasResumenMovil,
            ]}
          >
            <View
              style={
                styles.fechaResumenCard
              }
            >
              <Text
                style={
                  styles.fechaResumenEtiqueta
                }
              >
                LLEGADA
              </Text>

              <Text
                style={
                  styles.fechaResumenTexto
                }
              >
                {fechaBonita(
                  fechaLlegada
                )}
              </Text>
            </View>

            <View
              style={[
                styles.fechaResumenCard,

                !esMovil &&
                  styles.fechaResumenSeparado,
              ]}
            >
              <Text
                style={
                  styles.fechaResumenEtiqueta
                }
              >
                SALIDA
              </Text>

              <Text
                style={
                  styles.fechaResumenTexto
                }
              >
                {fechaBonita(
                  fechaSalida
                )}
              </Text>
            </View>
          </View>

          {/* CALENDARIO */}

          <View
            style={
              styles.calendario
            }
          >
            <View
              style={
                styles.calendarioHeader
              }
            >
              <TouchableOpacity
                style={
                  styles.mesBoton
                }
                onPress={
                  mesAnterior
                }
              >
                <Text
                  style={
                    styles.mesBotonTexto
                  }
                >
                  ‹
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.mesTitulo
                }
              >
                {mesVisible.toLocaleDateString(
                  'es-MX',
                  {
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </Text>

              <TouchableOpacity
                style={
                  styles.mesBoton
                }
                onPress={
                  mesSiguiente
                }
              >
                <Text
                  style={
                    styles.mesBotonTexto
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            {/* DÍAS SEMANA */}

            <View
              style={
                styles.semana
              }
            >
              {[
                'Dom',
                'Lun',
                'Mar',
                'Mié',
                'Jue',
                'Vie',
                'Sáb',
              ].map((dia) => (
                <Text
                  key={dia}
                  style={
                    styles.semanaTexto
                  }
                >
                  {dia}
                </Text>
              ))}
            </View>

            {/* DÍAS */}

            <View
              style={
                styles.diasGrid
              }
            >
              {diasCalendario.map(
                (
                  fecha,
                  index
                ) => {
                  if (!fecha) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={
                          styles.diaCaja
                        }
                      />
                    );
                  }

                  const fechaDia =
                    new Date(
                      fecha
                    );

                  fechaDia.setHours(
                    0,
                    0,
                    0,
                    0
                  );

                  const pasada =
                    fechaDia <
                    hoy;

                  const seleccionada =
                    !!esFechaSeleccionada(
                      fecha
                    );

                  const rango =
                    estaEnRango(
                      fecha
                    );

                  return (
                    <TouchableOpacity
                      key={
                        fecha.toISOString()
                      }
                      disabled={
                        pasada
                      }
                      style={[
                        styles.diaCaja,

                        rango &&
                          styles.diaRango,

                        seleccionada &&
                          styles.diaSeleccionado,
                      ]}
                      onPress={() =>
                        seleccionarFecha(
                          fecha
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.diaTexto,

                          pasada &&
                            styles.diaPasado,

                          rango &&
                            styles.diaRangoTexto,

                          seleccionada &&
                            styles.diaSeleccionadoTexto,
                        ]}
                      >
                        {fecha.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>

          {/* HUÉSPEDES */}

          <View
            style={
              styles.huespedesFila
            }
          >
            <View>
              <Text
                style={
                  styles.huespedesTitulo
                }
              >
                👥 Huéspedes
              </Text>

              <Text
                style={
                  styles.huespedesSubtitulo
                }
              >
                Máximo{' '}
                {detalle.capacidad}{' '}
                personas
              </Text>
            </View>

            <View
              style={
                styles.contador
              }
            >
              <TouchableOpacity
                style={
                  styles.contadorBoton
                }
                onPress={() =>
                  setHuespedes(
                    Math.max(
                      1,
                      huespedes - 1
                    )
                  )
                }
              >
                <Text
                  style={
                    styles.contadorSimbolo
                  }
                >
                  −
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.contadorNumero
                }
              >
                {huespedes}
              </Text>

              <TouchableOpacity
                style={
                  styles.contadorBoton
                }
                onPress={() =>
                  setHuespedes(
                    Math.min(
                      detalle.capacidad,
                      huespedes + 1
                    )
                  )
                }
              >
                <Text
                  style={
                    styles.contadorSimbolo
                  }
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RESUMEN DE PRECIO */}

          <View
            style={
              styles.resumenReserva
            }
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
                $
                {detalle.precio.toLocaleString(
                  'es-MX'
                )}{' '}
                × {noches}{' '}
                {noches === 1
                  ? 'noche'
                  : 'noches'}
              </Text>

              <Text
                style={
                  styles.resumenValor
                }
              >
                $
                {total.toLocaleString(
                  'es-MX'
                )}
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
                Total
              </Text>

              <Text
                style={
                  styles.totalPrecio
                }
              >
                $
                {total.toLocaleString(
                  'es-MX'
                )}
              </Text>
            </View>
          </View>

          {/* BOTÓN */}

          <TouchableOpacity
            disabled={
              !puedeReservar
            }
            style={[
              styles.boton,

              !puedeReservar &&
                styles.botonDeshabilitado,
            ]}
            onPress={() => setPagoAbierto(true)}
          >
            <Text
              style={
                styles.botonTexto
              }
            >
              {esEdicion
                ? 'Guardar cambios'
                : 'Continuar al pago'}
            </Text>
          </TouchableOpacity>

          {!puedeReservar && (
            <Text
              style={
                styles.ayudaReserva
              }
            >
              Selecciona una fecha de
              llegada y una fecha de
              salida para continuar.
            </Text>
          )}
        </View>
      </ScrollView>
      <Modal visible={pagoAbierto} transparent animationType="slide" onRequestClose={() => setPagoAbierto(false)}>
        <View style={estilosPago.fondo}>
          <View style={estilosPago.ventana} accessibilityViewIsModal>
            <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
              <Text style={estilosPago.titulo}>Confirmar reserva</Text>
              <Text style={estilosPago.texto}>{detalle.nombre} · {noches} noche{noches === 1 ? '' : 's'}</Text>
              <Text style={estilosPago.texto}>Total: ${total.toLocaleString('es-MX')} MXN</Text>
              <MetodosPago seleccionado={metodoSeleccionado?.id} onSeleccionar={(metodo) => setMetodoId(metodo.id)} />
              {!!errorPago && <Text accessibilityRole="alert" style={estilosPago.texto}>{errorPago}</Text>}
              <Pressable accessibilityRole="button" disabled={!metodoSeleccionado || guardando}
                accessibilityState={{ disabled: !metodoSeleccionado || guardando }}
                style={[estilosPago.boton, !metodoSeleccionado && { opacity: 0.4 }]}
                onPress={() => { void confirmarReserva(); }}>
                <Text style={estilosPago.botonTexto}>{guardando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Confirmar reserva · Pago pendiente'}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={estilosPago.boton} onPress={() => setPagoAbierto(false)}>
                <Text style={estilosPago.botonTexto}>Volver sin confirmar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
      paddingBottom: 60,
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
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 30,
    },

    etiqueta: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',

      textTransform:
        'uppercase',
    },

    titulo: {
      marginTop: 5,

      fontSize: 29,

      lineHeight: 35,

      fontWeight: '900',

      color: '#203438',
    },

    ubicacionFila: {
      marginTop: 7,

      flexDirection: 'row',

      flexWrap: 'wrap',

      alignItems: 'center',
    },

    ubicacion: {
      marginRight: 14,

      fontSize: 11,

      color: '#748589',
    },

    calificacion: {
      fontSize: 11,

      fontWeight: '900',

      color: '#203438',
    },

    /* GALERÍA */

    galeriaContenedor: {
      width: '100%',
      maxWidth: 930,

      alignSelf: 'center',

      marginTop: 22,
    },

    galeria: {
      paddingHorizontal: 15,
    },

    imagenGaleria: {
      width: 420,
      height: 270,

      marginHorizontal: 5,

      borderRadius: 24,

      backgroundColor:
        '#DDEEEB',
    },

    imagenGaleriaMovil: {
      width: 290,
      height: 210,
    },

    /* TARJETAS */

    card: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 20,

      padding: 21,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',
    },

    cardEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    cardTitulo: {
      fontSize: 18,

      fontWeight: '900',

      color: '#203438',
    },

    cardTituloGrande: {
      marginTop: 4,

      fontSize: 22,

      fontWeight: '900',

      color: '#203438',
    },

    cardSubtitulo: {
      marginTop: 5,

      fontSize: 10,

      lineHeight: 16,

      color: '#899699',
    },

    descripcion: {
      marginTop: 11,

      fontSize: 11,

      lineHeight: 18,

      color: '#53666A',
    },

    /* HABITACIÓN */

    habitacionCaja: {
      marginTop: 18,

      padding: 14,

      borderRadius: 17,

      backgroundColor:
        '#F5F9F8',
    },

    habitacionEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      color: '#087F8C',
    },

    habitacionNombre: {
      marginTop: 5,

      fontSize: 13,

      fontWeight: '900',

      color: '#203438',
    },

    /* DATOS */

    datosGrid: {
      marginTop: 15,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    datoCard: {
      minWidth: 110,

      marginRight: 9,
      marginBottom: 9,

      padding: 13,

      borderRadius: 17,

      backgroundColor:
        '#EAF5F3',

      alignItems: 'center',
    },

    datoEmoji: {
      fontSize: 19,
    },

    datoNumero: {
      marginTop: 4,

      fontSize: 16,

      fontWeight: '900',

      color: '#087F8C',
    },

    datoLabel: {
      marginTop: 2,

      fontSize: 8,

      color: '#53666A',
    },

    /* SERVICIOS */

    servicios: {
      marginTop: 14,

      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    servicioChip: {
      marginRight: 7,
      marginBottom: 7,

      paddingHorizontal: 11,
      paddingVertical: 8,

      borderRadius: 15,

      backgroundColor:
        '#EAF5F3',
    },

    servicioTexto: {
      fontSize: 9,

      fontWeight: '800',

      color: '#087F8C',
    },

    /* HORARIOS */

    horariosFila: {
      marginTop: 15,

      flexDirection: 'row',
    },

    horariosFilaMovil: {
      flexDirection: 'column',
    },

    horarioCard: {
      flex: 1,

      padding: 17,

      borderRadius: 18,

      backgroundColor:
        '#F5F9F8',
    },

    horarioCardSeparado: {
      marginLeft: 12,
    },

    horarioEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      color: '#087F8C',
    },

    horarioHora: {
      marginTop: 6,

      fontSize: 14,

      fontWeight: '900',

      color: '#203438',
    },

    /* POLÍTICAS */

    politicaFila: {
      paddingVertical: 13,

      flexDirection: 'row',

      alignItems: 'center',
    },

    politicaSeparador: {
      borderBottomWidth: 1,

      borderBottomColor:
        '#E7EEEE',
    },

    politicaNumero: {
      width: 29,
      height: 29,

      marginRight: 11,

      borderRadius: 15,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    politicaNumeroTexto: {
      fontSize: 9,

      fontWeight: '900',

      color: '#087F8C',
    },

    politicaTexto: {
      flex: 1,

      fontSize: 10,

      lineHeight: 16,

      color: '#53666A',
    },

    /* FECHAS RESUMEN */

    fechasResumen: {
      marginTop: 18,

      flexDirection: 'row',
    },

    fechasResumenMovil: {
      flexDirection: 'column',
    },

    fechaResumenCard: {
      flex: 1,

      padding: 14,

      borderRadius: 17,

      backgroundColor:
        '#F5F9F8',
    },

    fechaResumenSeparado: {
      marginLeft: 10,
    },

    fechaResumenEtiqueta: {
      fontSize: 8,

      fontWeight: '900',

      color: '#087F8C',
    },

    fechaResumenTexto: {
      marginTop: 5,

      fontSize: 11,

      fontWeight: '800',

      color: '#203438',
    },

    /* CALENDARIO */

    calendario: {
      marginTop: 18,

      padding: 15,

      borderRadius: 20,

      backgroundColor:
        '#F5F9F8',
    },

    calendarioHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom: 14,
    },

    mesBoton: {
      width: 36,
      height: 36,

      borderRadius: 18,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    mesBotonTexto: {
      marginTop: -3,

      fontSize: 25,

      fontWeight: '700',

      color: '#087F8C',
    },

    mesTitulo: {
      fontSize: 14,

      fontWeight: '900',

      color: '#203438',

      textTransform:
        'capitalize',
    },

    semana: {
      flexDirection: 'row',
    },

    semanaTexto: {
      width: '14.2857%',

      paddingVertical: 8,

      textAlign: 'center',

      fontSize: 8,

      fontWeight: '900',

      color: '#899699',
    },

    diasGrid: {
      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    diaCaja: {
      width: '14.2857%',

      height: 45,

      justifyContent:
        'center',

      alignItems: 'center',
    },

    diaTexto: {
      width: 35,
      height: 35,

      borderRadius: 18,

      textAlign: 'center',

      lineHeight: 35,

      fontSize: 10,

      fontWeight: '800',

      color: '#203438',
    },

    diaPasado: {
      color: '#C8D0D0',
    },

    diaRango: {
      backgroundColor:
        '#EAF5F3',
    },

    diaRangoTexto: {
      color: '#087F8C',
    },

    diaSeleccionado: {
      backgroundColor:
        '#087F8C',

      borderRadius: 20,
    },

    diaSeleccionadoTexto: {
      backgroundColor:
        '#087F8C',

      color: '#FFFFFF',
    },

    /* HUÉSPEDES */

    huespedesFila: {
      marginTop: 20,

      paddingVertical: 16,

      borderTopWidth: 1,

      borderBottomWidth: 1,

      borderColor:
        '#E7EEEE',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    huespedesTitulo: {
      fontSize: 12,

      fontWeight: '900',

      color: '#203438',
    },

    huespedesSubtitulo: {
      marginTop: 4,

      fontSize: 9,

      color: '#899699',
    },

    contador: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    contadorBoton: {
      width: 38,
      height: 38,

      borderRadius: 19,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    contadorSimbolo: {
      fontSize: 19,

      fontWeight: '900',

      color: '#087F8C',
    },

    contadorNumero: {
      marginHorizontal: 15,

      fontSize: 15,

      fontWeight: '900',

      color: '#203438',
    },

    /* RESUMEN */

    resumenReserva: {
      marginTop: 18,

      padding: 16,

      borderRadius: 18,

      backgroundColor:
        '#F5F9F8',
    },

    resumenFila: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    resumenLabel: {
      fontSize: 10,

      color: '#53666A',
    },

    resumenValor: {
      fontSize: 11,

      fontWeight: '800',

      color: '#203438',
    },

    totalSeparador: {
      height: 1,

      marginVertical: 13,

      backgroundColor:
        '#DDE8E6',
    },

    totalLabel: {
      fontSize: 13,

      fontWeight: '900',

      color: '#203438',
    },

    totalPrecio: {
      fontSize: 20,

      fontWeight: '900',

      color: '#087F8C',
    },

    /* BOTÓN */

    boton: {
      marginTop: 18,

      paddingVertical: 15,

      borderRadius: 20,

      backgroundColor:
        '#087F8C',

      alignItems: 'center',
    },

    botonDeshabilitado: {
      opacity: 0.4,
    },

    botonTexto: {
      fontSize: 11,

      fontWeight: '900',

      color: '#FFFFFF',
    },

    ayudaReserva: {
      marginTop: 9,

      fontSize: 8,

      textAlign: 'center',

      color: '#899699',
    },

    /* ERROR */

    errorCard: {
      width: '90%',
      maxWidth: 600,

      alignSelf: 'center',

      marginTop: 60,

      padding: 30,

      borderRadius: 25,

      backgroundColor:
        '#FFFFFF',

      alignItems: 'center',
    },

    errorEmoji: {
      fontSize: 50,
    },

    errorTitulo: {
      marginTop: 12,

      fontSize: 18,

      fontWeight: '900',

      color: '#203438',
    },
  });
