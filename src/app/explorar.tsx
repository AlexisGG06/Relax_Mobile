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
import { useCatalogos } from '../context/CatalogosContext';

export default function ExplorarScreen() {
  const router = useRouter();
  const { zonas } = useCatalogos();

  const { width } =
    useWindowDimensions();

  const esMovil =
    width < 700;

  const categorias = [
    {
      id: 'lugares',
      emoji: '🏞️',
      titulo: 'Lugares',
      subtitulo:
        'Conoce las zonas turísticas',
      descripcion:
        'Explora Huasca de Ocampo, Real del Monte y Mineral del Chico. Consulta actividades, restaurantes, atractivos y guarda tus favoritos.',
      ruta: '/lugares',
    },

    {
      id: 'hospedajes',
      emoji: '🏨',
      titulo: 'Hospedajes',
      subtitulo:
        'Encuentra dónde quedarte',
      descripcion:
        'Consulta hoteles, posadas y cabañas disponibles en cada zona, sus servicios, capacidad, precios y fechas.',
      ruta: '/hospedajes',
    },

    {
      id: 'actividades',
      emoji: '🎡',
      titulo: 'Actividades',
      subtitulo:
        'Planea qué hacer',
      descripcion:
        'Después de reservar tu hospedaje podrás consultar las actividades de esa misma zona y agregar las que quieras a tu viaje.',
      ruta: '/actividades',
    },

    {
      id: 'restaurantes',
      emoji: '🍽️',
      titulo: 'Restaurantes',
      subtitulo:
        'Descubre qué comer',
      descripcion:
        'Consulta restaurantes de la zona donde te hospedarás, conoce su tipo de comida, menú y agrega tus opciones favoritas.',
      ruta: '/restaurantes',
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
            EXPLORA
          </Text>

          <Text style={styles.titulo}>
            ¿Qué quieres conocer?
          </Text>

          <Text
            style={
              styles.descripcionPagina
            }
          >
            Encuentra lugares,
            hospedajes, actividades y
            restaurantes para comenzar a
            organizar tu experiencia por
            Hidalgo.
          </Text>
        </View>

        {/* =====================================
            DESTINOS DESTACADOS
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
            Destinos principales
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Tres zonas para comenzar a
            explorar
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
            Explora RELAX
          </Text>

          <Text
            style={
              styles.seccionTexto
            }
          >
            Todo lo que necesitas para
            organizar tu viaje
          </Text>
        </View>

        <View
          style={styles.categorias}
        >
          {categorias.map(
            (categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={styles.categoriaCard}
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

                <View
                  style={
                    styles.categoriaInfo
                  }
                >
                  <Text
                    style={
                      styles.categoriaSubtitulo
                    }
                  >
                    {
                      categoria.subtitulo
                    }
                  </Text>

                  <Text
                    style={
                      styles.categoriaTitulo
                    }
                  >
                    {
                      categoria.titulo
                    }
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
                </View>

                <View
                  style={
                    styles.flechaCaja
                  }
                >
                  <Text
                    style={
                      styles.flecha
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
            MENSAJE FINAL
        ===================================== */}

        <View
          style={
            styles.infoCard
          }
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
              💡
            </Text>
          </View>

          <View
            style={{ flex: 1 }}
          >
            <Text
              style={
                styles.infoTitulo
              }
            >
              ¿Cómo funciona RELAX?
            </Text>

            <Text
              style={
                styles.infoTexto
              }
            >
              Primero explora una zona,
              guarda actividades y
              restaurantes favoritos,
              reserva tu hospedaje y
              después organiza todo desde
              Mi viaje.
            </Text>
          </View>
        </View>
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
        >
          <Text
            style={[
              styles.navEmoji,
              styles.navActivo,
            ]}
          >
            🔍
          </Text>

          <Text
            style={[
              styles.navTexto,
              styles.navTextoActivo,
            ]}
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

      paddingHorizontal: 25,

      marginTop: 30,
    },

    etiqueta: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,

      color: '#087F8C',
    },

    titulo: {
      maxWidth: 600,

      marginTop: 5,

      fontSize: 30,

      lineHeight: 36,

      fontWeight: '900',

      color: '#203438',
    },

    descripcionPagina: {
      maxWidth: 650,

      marginTop: 8,

      fontSize: 12,

      lineHeight: 19,

      color: '#748589',
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

      minHeight: 210,

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
      marginTop: 15,

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

    /* CATEGORÍAS */

    categorias: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 15,
    },

    categoriaCard: {
      marginBottom: 12,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      alignItems: 'center',
    },

    categoriaEmojiCaja: {
      width: 62,
      height: 62,

      marginRight: 16,

      borderRadius: 20,

      backgroundColor:
        '#EAF5F3',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    categoriaEmoji: {
      fontSize: 29,
    },

    categoriaInfo: {
      flex: 1,

      minWidth: 0,
    },

    categoriaSubtitulo: {
      fontSize: 8,

      fontWeight: '900',

      textTransform:
        'uppercase',

      color: '#087F8C',
    },

    categoriaTitulo: {
      marginTop: 4,

      fontSize: 17,

      fontWeight: '900',

      color: '#203438',
    },

    categoriaDescripcion: {
      maxWidth: 650,

      marginTop: 6,

      fontSize: 10,

      lineHeight: 16,

      color: '#748589',
    },

    flechaCaja: {
      width: 40,
      height: 40,

      marginLeft: 10,

      borderRadius: 20,

      backgroundColor:
        '#F5F9F8',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    flecha: {
      marginTop: -3,

      fontSize: 28,

      color: '#087F8C',
    },

    /* INFORMACIÓN */

    infoCard: {
      width: '90%',
      maxWidth: 900,

      alignSelf: 'center',

      marginTop: 18,

      padding: 18,

      borderRadius: 24,

      backgroundColor:
        '#EAF5F3',

      flexDirection: 'row',

      alignItems: 'center',
    },

    infoIconoCaja: {
      width: 48,
      height: 48,

      marginRight: 14,

      borderRadius: 17,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    infoIcono: {
      fontSize: 24,
    },

    infoTitulo: {
      fontSize: 13,

      fontWeight: '900',

      color: '#203438',
    },

    infoTexto: {
      maxWidth: 700,

      marginTop: 5,

      fontSize: 10,

      lineHeight: 16,

      color: '#53666A',
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